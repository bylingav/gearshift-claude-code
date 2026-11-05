import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

type Tier = 'haiku' | 'sonnet' | 'opus'
type Level = 'off' | 'lite' | 'full' | 'ultra'

const LEVELS: readonly Level[] = ['off', 'lite', 'full', 'ultra']
const DESC: Record<Level, string> = {
  off: 'sin enrutado',
  lite: 'solo subagentes',
  full: 'subagentes + hilo principal (heurística)',
  ultra: 'como full, clasificando con un modelo pequeño',
}

// usage-bar dibuja este valor en su banda.
const tierAtom = atom({ plugin: 'model-router', key: 'tier' } as const, '')
// usage-bar dibuja y cambia este nivel con botones.
const levelAtom = atom({ plugin: 'model-router', key: 'level' } as const, 'full')
const lvl = async ($: Parameters<typeof read>[0]) => {
  const v = (await read($, levelAtom)) as Level
  return LEVELS.includes(v) ? v : 'full'
}

const HARD = /\b(arquitectur|refactor|migra|dise[ñn]|debug|race condition|concurren|segur|vulnerab|optimiz|rendimiento|algoritmo|investiga|root cause|architecture|redesign|security|performance|prove|why .*fail)/i
const EASY = /\b(typo|renombra|rename|formatea|format|traduce|translate|lista|list|resume|summar|qué es|what is|explica brevemente|comentario|comment|lint)\b/i

// Heurística local y gratis: shortcut: palabras clave + longitud.
export function pick(text: string): Tier {
  const len = text.length
  const hard = HARD.test(text)
  const easy = EASY.test(text)
  if (hard && (len > 200 || /\b(todo|entire|whole|todos los)\b/i.test(text))) return 'opus'
  if (easy && !hard && len < 300) return 'haiku'
  if (len < 60 && !hard) return 'haiku'
  if (len > 1500 || (hard && len > 80)) return 'opus'
  return 'sonnet'
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    $.ui.status(undefined) // limpia la línea de estado de versiones anteriores
    const saved = await $.store.get('level')
    if (LEVELS.includes(saved as Level)) await update($, levelAtom, () => saved as string)
    await $.command.register({
      name: 'router',
      description: 'Nivel del model router: off, lite, full, ultra',
      argumentHint: LEVELS.join('|'),
    })
    return next(e)
  })

  on('command.run', { command: 'router' }, async ($, e) => {
    const level = await lvl($)
    const arg = e.args.trim().toLowerCase() as Level
    if (!LEVELS.includes(arg)) {
      return { text: `router: ${level} (${DESC[level]}). Uso: /router ${LEVELS.join('|')}` }
    }
    await update($, levelAtom, () => arg)
    await $.store.set('level', arg)
    if (arg === 'off' || arg === 'lite') await update($, tierAtom, () => '')
    return { text: `router: ${arg} (${DESC[arg]})` }
  })

  // Subagentes: si la llamada no fija modelo, decide la complejidad del encargo.
  on('agent.spawn', async ($, e, next) =>
    (await lvl($)) === 'off' || e.model || e.fork
      ? next(e)
      : next({ ...e, model: pick(`${e.description ?? ''}\n${e.prompt}`) }),
  )

  // Hilo principal: cambia la fila `model` de /config; si el motor la rechaza, la banda solo muestra la elección.
  on('prompt.submit', async ($, e, next) => {
    const level = await lvl($)
    await $.store.set('level', level) // persiste lo elegido con los botones
    if ((level === 'full' || level === 'ultra') && !e.command && !e.isMeta) {
      let tier = pick(e.text)
      if (level === 'ultra') {
        try {
          const t = await $.model.classify(e.text.slice(0, 4000), ['haiku', 'sonnet', 'opus'])
          if (t) tier = t as Tier
        } catch {
          // shortcut: si el clasificador falla se queda la heurística.
        }
      }
      const current = await $.session.model()
      if (!current.toLowerCase().includes(tier)) {
        try {
          await $.config.set({ key: 'model', value: tier })
        } catch {
          // shortcut: sin fila `model` o sin alias, solo queda la sugerencia en la banda.
        }
      }
      await update($, tierAtom, () => tier)
    }
    return next(e)
  })
}
