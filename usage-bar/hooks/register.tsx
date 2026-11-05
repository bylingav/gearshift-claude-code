import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit } from '../types'

const tier = atom({ plugin: 'model-router', key: 'tier' } as const, '')
const levelAtom = atom({ plugin: 'model-router', key: 'level' } as const, 'full')
const LEVELS = ['off', 'lite', 'full', 'ultra']
const limits = atom({ plugin: 'usage-bar', key: 'limits' } as const, [] as Limit[])

const LABEL: Record<string, string> = { five_hour: 'Sesión', seven_day: 'Semana' }
const W = 12
// Triage: tono, luminosidad y forma distintos por modelo, distinguible con daltonismo por tono y luminosidad.
const MODEL_COLOR: Record<string, string> = { haiku: '#14b8a6', sonnet: '#8b5cf6', opus: '#eab308' }
const MODEL_GLYPH: Record<string, string> = { haiku: '●', sonnet: '●', opus: '●' }

// Azul hasta 90 %, naranja de 90 a 95, rojo desde 95.
export const colorOf = (p: number) => (p >= 95 ? '#ef4444' : p >= 90 ? '#f59e0b' : '#3b82f6')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    $.ui.status(undefined) // limpia la línea de estado de la versión 0.1
    const { rateLimits } = await $.session.usage()
    await update($, limits, () => rateLimits)
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) await update($, limits, () => e.rateLimits)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const all = await read($, limits)
    const actual = (await $.session.model()).toLowerCase()
    const name = ['haiku', 'sonnet', 'opus'].find(m => actual.includes(m))
    const wanted = await read($, tier)
    const suggest = wanted && wanted !== name ? wanted : undefined
    if (e.props.hasSurvey || (all.length === 0 && !name)) return next(e)

    const ui = $.ui.resolve(e)
    const { Box, Text, Button } = ui
    const level = await read($, levelAtom)

    return (
      <Box gap={3}>
        {name ? <Text color={MODEL_COLOR[name]} bold>{MODEL_GLYPH[name]} {name}</Text> : null}
        {suggest ? <Text color={MODEL_COLOR[suggest]}>→ {suggest}</Text> : null}
        <Box gap={1}>
          {LEVELS.map(l => (
            <Button key={l} label={l === level ? `● ${l}` : l} onPress={() => $.command.run({ command: 'router', args: l })} />
          ))}
        </Box>
        {all.map(l => {
          const p = Math.max(0, Math.min(100, l.percentUsed))
          const filled = Math.round((p / 100) * W)
          return (
            <Box key={l.kind} gap={1}>
              <Text dimColor>{LABEL[l.kind] ?? l.kind}</Text>
              {e.surface === 'terminal' ? (
                <Box width={W}>
                  {filled > 0 ? <Box width={filled} height={1} backgroundColor={colorOf(p)} /> : null}
                  {filled < W ? <Box width={W - filled} height={1} backgroundColor="#374151" /> : null}
                </Box>
              ) : (
                <ui.Svg
                  alt={`${Math.round(p)}%`}
                  width={96}
                  height={4}
                  source={`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="4" viewBox="0 0 96 4"><rect width="96" height="4" rx="2" fill="#374151"/><rect width="${(p / 100) * 96}" height="4" rx="2" fill="${colorOf(p)}"/></svg>`}
                />
              )}
              <Text dimColor>{Math.round(p)}%</Text>
            </Box>
          )
        })}
      </Box>
    )
  })
}
