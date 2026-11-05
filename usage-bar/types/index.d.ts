export type Limit = { kind: string; percentUsed: number }

declare module 'claude-code' {
  interface PluginState {
    'usage-bar': { limits: Limit[] }
    'model-router': { tier: string; level: string }
  }
}
