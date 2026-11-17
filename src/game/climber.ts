export type Side = 'left' | 'right'
export type HoldKind = 'normal' | 'jug' | 'crimp'
export type ClimbHold = { side: Side; kind: HoldKind }
export type ClimbStatus = 'ready' | 'playing' | 'paused' | 'fallen'
export type ClimbState = {
  seed: number; status: ClimbStatus; step: number; height: number; side: Side | null
  kind: HoldKind; elapsed: number; budget: number; cooldown: number
  combo: number; maxCombo: number; saves: number; feedback: string; event: number
  lastMove: 'start' | 'clean' | 'catch' | 'slip'; reason: 'time' | 'wrong' | 'early' | null
}

export const PERFECT_START = .3
export const PERFECT_END = .6
export const MIN_REACH = .14
export const BEST_KEY = 'tim:endless-climber:best:v1'

// A route is generated from its seed and row, so the visible preview is always
// the route that will be played. No growing history or impossible random jumps.
function randomAt(seed: number, row: number) {
  let n = (seed ^ Math.imul(row + 1, 0x9e3779b9)) >>> 0
  n = Math.imul(n ^ (n >>> 16), 0x21f0aaad)
  n = Math.imul(n ^ (n >>> 15), 0x735a2d97)
  return ((n ^ (n >>> 15)) >>> 0) / 4294967296
}

export function routeRow(seed: number, row: number): ClimbHold[] {
  const opening: Side[] = ['left', 'right', 'left', 'left', 'right', 'right']
  if (row <= 6) return [{ side: opening[Math.max(0, row - 1)], kind: row === 5 ? 'jug' : 'normal' }]
  const value = randomAt(seed, row)
  const side: Side = value < .5 ? 'left' : 'right'
  if (row >= 10 && row % 7 === 3) return [{ side, kind: 'jug' }, { side: side === 'left' ? 'right' : 'left', kind: 'crimp' }]
  // Regular rest holds break up the faster sequences, even late in a run.
  const kind: HoldKind = row % 6 === 5 ? 'jug' : row >= 8 && randomAt(seed + 13, row) < .28 ? 'crimp' : 'normal'
  return [{ side, kind }]
}

export function holdTime(step: number, kind: HoldKind) {
  const base = Math.max(1050, 2300 - step * 28)
  return Math.round(base * (kind === 'jug' ? 1.5 : kind === 'crimp' ? .68 : 1))
}

export function createClimb(seed = 1): ClimbState {
  return { seed, status: 'ready', step: 0, height: 0, side: null, kind: 'jug', elapsed: 0, budget: 3200, cooldown: 0, combo: 0, maxCombo: 0, saves: 1, feedback: 'Dein nächster Griff wartet.', event: 0, lastMove: 'start', reason: null }
}

export function startClimb(seed: number): ClimbState { return { ...createClimb(seed), status: 'playing' } }
export function pauseClimb(state: ClimbState): ClimbState { return state.status === 'playing' ? { ...state, status: 'paused' } : state }
export function resumeClimb(state: ClimbState): ClimbState { return state.status === 'paused' ? { ...state, status: 'playing' } : state }

function miss(state: ClimbState, reason: 'time' | 'wrong' | 'early'): ClimbState {
  if (state.saves > 0) return { ...state, saves: 0, combo: 0, elapsed: 0, cooldown: 320, feedback: `${reason === 'early' ? 'Zu hektisch.' : reason === 'wrong' ? 'Daneben.' : 'Abgerutscht.'} Gerade noch gefangen!`, lastMove: 'slip', event: state.event + 1 }
  return { ...state, status: 'fallen', combo: 0, reason, feedback: reason === 'time' ? 'Die Schwerkraft war schneller.' : reason === 'early' ? 'Die Hände schneller als der Kopf.' : 'Es lag am Griff.', event: state.event + 1 }
}

export function tickClimb(state: ClimbState, milliseconds: number): ClimbState {
  if (state.status !== 'playing' || !Number.isFinite(milliseconds) || milliseconds <= 0) return state
  const elapsed = state.elapsed + milliseconds
  const next = { ...state, elapsed, cooldown: Math.max(0, state.cooldown - milliseconds) }
  return elapsed >= state.budget ? miss(next, 'time') : next
}

export function reachClimb(state: ClimbState, side: Side): ClimbState {
  if (state.status !== 'playing' || state.cooldown > 0) return state
  const target = routeRow(state.seed, state.step + 1).find(hold => hold.side === side)
  if (!target) return miss(state, 'wrong')
  const progress = state.elapsed / state.budget
  if (progress < MIN_REACH) return miss(state, 'early')
  const clean = progress >= PERFECT_START && progress <= PERFECT_END
  const combo = clean ? state.combo + 1 : 0
  const gain = target.kind === 'crimp' ? 2.8 : target.kind === 'jug' ? 1.6 : 2
  return {
    ...state, step: state.step + 1, side, kind: target.kind,
    height: Math.round((state.height + gain) * 10) / 10,
    elapsed: 0, budget: holdTime(state.step + 1, target.kind), cooldown: 160,
    combo, maxCombo: Math.max(combo, state.maxCombo),
    feedback: clean ? combo >= 3 ? `${combo} in Folge. Im Flow!` : 'Sauber!' : progress > PERFECT_END ? 'Knapp, aber dran.' : 'Griff sitzt.',
    lastMove: clean ? 'clean' : 'catch', event: state.event + 1,
  }
}

export type ClimbAction = { type: 'start'; seed: number } | { type: 'tick'; delta: number } | { type: 'reach'; side: Side } | { type: 'pause' | 'resume' }
export function climbReducer(state: ClimbState, action: ClimbAction): ClimbState {
  switch (action.type) {
    case 'start': return startClimb(action.seed)
    case 'tick': return tickClimb(state, action.delta)
    case 'reach': return reachClimb(state, action.side)
    case 'pause': return pauseClimb(state)
    case 'resume': return resumeClimb(state)
  }
}

export function readBest(): number {
  try {
    const value = Number(localStorage.getItem(BEST_KEY))
    return Number.isFinite(value) && value >= 0 && value <= 1_000_000 ? value : 0
  } catch { return 0 }
}
export function saveBest(height: number): void {
  if (!Number.isFinite(height) || height < 0 || height > 1_000_000) return
  try { localStorage.setItem(BEST_KEY, String(Math.max(readBest(), height))) } catch { /* Storage may be unavailable; the in-memory record still works. */ }
}
export const formatHeight = (height: number) => height.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
