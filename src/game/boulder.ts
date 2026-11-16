export type Hold = { id: string; x: number; y: number; label: string; rotation: number }
export const holds: Hold[] = [
  { id: 'start', x: 20, y: 90, label: 'Start', rotation: -15 },
  { id: 'a', x: 47, y: 75, label: 'Griff 1', rotation: 20 },
  { id: 'b', x: 23, y: 56, label: 'Griff 2', rotation: -30 },
  { id: 'c', x: 46, y: 40, label: 'Griff 3', rotation: 10 },
  { id: 'd', x: 62, y: 23, label: 'Griff 4', rotation: 40 },
  { id: 'top', x: 33, y: 8, label: 'Top', rotation: -12 },
  { id: 'e', x: 76, y: 59, label: 'Seitgriff 1', rotation: 32 },
  { id: 'f', x: 91, y: 82, label: 'Seitgriff 2', rotation: -22 },
]
export const MAX_MOVES = 7
export const REACH = 33.5
export type GameState = { path: string[]; remaining: number; status: 'playing' | 'won' | 'lost'; message: string }
export const createGame = (): GameState => ({ path: ['start'], remaining: MAX_MOVES, status: 'playing', message: 'Du bist am Start. Welcher Griff bringt dich weiter?' })
export function isReachable(fromId: string, toId: string): boolean {
  const from = holds.find((hold) => hold.id === fromId)
  const to = holds.find((hold) => hold.id === toId)
  return !!from && !!to && from !== to && Math.hypot(from.x - to.x, from.y - to.y) <= REACH
}
export function moveTo(state: GameState, toId: string): GameState {
  if (state.status !== 'playing') return state
  const from = state.path[state.path.length - 1]
  if (toId === from) return { ...state, message: 'Hier bist du schon. Suche den nächsten Griff.' }
  if (!isReachable(from, toId)) return { ...state, message: 'Noch außer Reichweite. Die umrandeten Griffe sind erreichbar.' }
  const remaining = state.remaining - 1
  const path = [...state.path, toId]
  if (toId === 'top') return { path, remaining, status: 'won', message: `Top! Du hast das Problem in ${MAX_MOVES - remaining} Zügen gelöst.` }
  if (remaining === 0) return { path, remaining, status: 'lost', message: 'Die Kraft ist aufgebraucht. Schau dir die Route an und versuche einen anderen Weg.' }
  return { path, remaining, status: 'playing', message: `${holds.find((hold) => hold.id === toId)!.label} erreicht. Noch ${remaining} ${remaining === 1 ? 'Zug' : 'Züge'}.` }
}
