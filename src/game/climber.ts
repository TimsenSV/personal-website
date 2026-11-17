export type Side = 'left' | 'center' | 'right'
export type HoldKind = 'normal' | 'jug' | 'crimp' | 'loose'
export type ClimbHold = { side: Side; kind: HoldKind; powerup?: 'energy' }
export type DynoBoost = { elapsed: number; step: number; height: number; side: Side; kind: HoldKind; advancedFrom: number | null }
export type ClimbStatus = 'ready' | 'playing' | 'paused' | 'fallen'
export type TimingZone = { center: number; width: number; change: 'steady' | 'wider' | 'narrower' }
export type ClimbState = {
  seed: number; status: ClimbStatus; step: number; height: number; side: Side | null
  kind: HoldKind; elapsed: number; budget: number; cooldown: number
  combo: number; maxCombo: number; saves: number; feedback: string; event: number
  lastMove: 'start' | 'clean' | 'catch' | 'slip' | 'boost'; reason: 'time' | 'wrong' | 'early' | 'broken' | null
  boost: DynoBoost | null; grips: number
  advancedFrom: number | null
  zone: TimingZone
}

export const CLIMB_NAME = 'Grip Happens'
export const BOOST_DURATION = 1100
export const BOOST_ROWS = 3
export const boostProgress = (boost: DynoBoost) => {
  const t = Math.min(1, boost.elapsed / BOOST_DURATION)
  return t * t * (3 - 2 * t)
}
export const ZONE_INITIAL_WIDTH = .3
export const ZONE_MIN_WIDTH = .2
export const ZONE_MAX_WIDTH = .42
export const MIN_REACH = .14
export const ADVANCED_HEIGHT = 70
export const THREE_LANE_SECTION_LENGTH = 4
export const NORMAL_SECTION_LENGTH = 8
export const BEST_KEY = 'tim:endless-climber:best:v1'

export function zoneBounds(zone: TimingZone) { return { start: zone.center - zone.width / 2, end: zone.center + zone.width / 2 } }
export function isInTimingZone(progress: number, zone: TimingZone) {
  const { start, end } = zoneBounds(zone)
  return progress >= start - 1e-9 && progress <= end + 1e-9
}

// The zone only moves when a new hold is reached. It never moves underneath
// the time cursor, and a rescue keeps its center so the retry stays readable.
function adaptZone(state: ClimbState, clean: boolean, move: boolean): TimingZone {
  const width = Math.round(Math.max(ZONE_MIN_WIDTH, Math.min(ZONE_MAX_WIDTH, state.zone.width + (clean ? .025 : -.035))) * 1000) / 1000
  const random = randomAt(state.seed + 97, state.step + 1)
  const shift = move ? (random < .5 ? -1 : 1) * (.025 + Math.abs(random - .5) * .08) : 0
  const center = Math.max(.17 + width / 2, Math.min(.88 - width / 2, state.zone.center + shift))
  return { center, width, change: width === state.zone.width ? 'steady' : width > state.zone.width ? 'wider' : 'narrower' }
}

// A route is generated from its seed and row, so the visible preview is always
// the route that will be played. No growing history or impossible random jumps.
function randomAt(seed: number, row: number) {
  let n = (seed ^ Math.imul(row + 1, 0x9e3779b9)) >>> 0
  n = Math.imul(n ^ (n >>> 16), 0x21f0aaad)
  n = Math.imul(n ^ (n >>> 15), 0x735a2d97)
  return ((n ^ (n >>> 15)) >>> 0) / 4294967296
}

export function isThreeLaneRow(row: number, advancedFrom: number | null) {
  return advancedFrom !== null && row >= advancedFrom && (row - advancedFrom) % (THREE_LANE_SECTION_LENGTH + NORMAL_SECTION_LENGTH) < THREE_LANE_SECTION_LENGTH
}

function rowHolds(seed: number, row: number, advancedFrom: number | null): ClimbHold[] {
  if (isThreeLaneRow(row, advancedFrom)) {
    const sides: Side[] = ['left', 'center', 'right']
    const loose = Math.floor(randomAt(seed + 43, row) * sides.length)
    return sides.map((side, index) => ({
      side,
      // Exactly one trap, with two reachable alternatives. Rest rows retain a jug.
      kind: index === loose ? 'loose' : row % 6 === 5 && index === (loose + 1) % 3 ? 'jug' : randomAt(seed + 71 + index, row) < .25 ? 'crimp' : 'normal',
    }))
  }
  const opening: Side[] = ['left', 'right', 'left', 'left', 'right', 'right']
  if (row <= 6) return [{ side: opening[Math.max(0, row - 1)], kind: row === 5 ? 'jug' : 'normal' }]
  const value = randomAt(seed, row)
  const side: Side = value < .5 ? 'left' : 'right'
  if (row >= 10 && row % 7 === 3) return [{ side, kind: 'jug' }, { side: side === 'left' ? 'right' : 'left', kind: 'crimp' }]
  // Regular rest holds break up the faster sequences, even late in a run.
  const kind: HoldKind = row % 6 === 5 ? 'jug' : row >= 8 && randomAt(seed + 13, row) < .28 ? 'crimp' : 'normal'
  return [{ side, kind }]
}

export function routeRow(seed: number, row: number, advancedFrom: number | null = null): ClimbHold[] {
  const holds = rowHolds(seed, row, advancedFrom)
  const block = Math.floor((row - 12) / 18)
  const energyRow = 12 + block * 18 + Math.floor(randomAt(seed + 211, block) * 4)
  if (row < 12 || row !== energyRow) return holds
  const safe = holds.filter(hold => hold.kind !== 'loose')
  const selected = safe[Math.floor(randomAt(seed + 223, row) * safe.length)]
  return holds.map(hold => hold === selected ? { ...hold, powerup: 'energy' } : hold)
}

const holdGain = (kind: HoldKind) => kind === 'crimp' ? 2.8 : kind === 'jug' ? 1.6 : 2

function planBoost(state: ClimbState): DynoBoost {
  let { height, side, kind } = state
  for (let row = state.step + 1; row <= state.step + BOOST_ROWS; row++) {
    const safe = routeRow(state.seed, row, state.advancedFrom).filter(hold => hold.kind !== 'loose')
    const landing = safe.find(hold => hold.side === side) ?? safe[0]
    side = landing.side; kind = landing.kind; height += holdGain(kind)
  }
  const step = state.step + BOOST_ROWS
  return { elapsed: 0, step, height: Math.round(height * 10) / 10, side: side!, kind,
    advancedFrom: state.advancedFrom ?? (height >= ADVANCED_HEIGHT ? step + 1 : null) }
}

export function holdTime(step: number, kind: HoldKind) {
  const base = Math.max(1050, 2300 - step * 28)
  return Math.round(base * (kind === 'jug' ? 1.5 : kind === 'crimp' ? .68 : 1))
}

export function createClimb(seed = 1): ClimbState {
  return { seed, status: 'ready', step: 0, height: 0, side: null, kind: 'jug', elapsed: 0, budget: 3200, cooldown: 0, combo: 0, maxCombo: 0, saves: 1, feedback: 'Your next hold is waiting.', event: 0, lastMove: 'start', reason: null, advancedFrom: null, boost: null, grips: 0, zone: { center: .45, width: ZONE_INITIAL_WIDTH, change: 'steady' } }
}

export function startClimb(seed: number): ClimbState { return { ...createClimb(seed), status: 'playing' } }
export function pauseClimb(state: ClimbState): ClimbState { return state.status === 'playing' ? { ...state, status: 'paused' } : state }
export function resumeClimb(state: ClimbState): ClimbState { return state.status === 'paused' ? { ...state, status: 'playing' } : state }

function miss(state: ClimbState, reason: 'time' | 'wrong' | 'early'): ClimbState {
  const zone = adaptZone(state, false, false)
  if (state.saves > 0) return { ...state, zone, saves: 0, combo: 0, elapsed: 0, cooldown: 320, feedback: `${reason === 'early' ? 'Too eager.' : reason === 'wrong' ? 'Missed it.' : 'Slipped.'} Caught yourself. Just!`, lastMove: 'slip', event: state.event + 1 }
  return { ...state, zone, status: 'fallen', combo: 0, reason, feedback: reason === 'time' ? 'Gravity got there first.' : reason === 'early' ? 'Hands faster than your brain.' : 'It was definitely the hold.', event: state.event + 1 }
}

export function tickClimb(state: ClimbState, milliseconds: number): ClimbState {
  if (state.status !== 'playing' || !Number.isFinite(milliseconds) || milliseconds <= 0) return state
  if (state.boost) {
    const boost = { ...state.boost, elapsed: state.boost.elapsed + milliseconds }
    if (boost.elapsed < BOOST_DURATION) return { ...state, boost }
    // The flight never consumes the next hold's timing window, even on a long tick.
    return { ...state, step: boost.step, height: boost.height, side: boost.side, kind: boost.kind,
      advancedFrom: boost.advancedFrom, boost: null, elapsed: 0, cooldown: 160,
      budget: Math.max(state.advancedFrom === null && boost.advancedFrom !== null ? 3200 : 2400, holdTime(boost.step, boost.kind)),
      lastMove: 'boost', event: state.event + 1, feedback: `Stuck the landing. +${formatHeight(boost.height - state.height)} m!` }
  }
  const elapsed = state.elapsed + milliseconds
  const next = { ...state, elapsed, cooldown: Math.max(0, state.cooldown - milliseconds) }
  return elapsed >= state.budget ? miss(next, 'time') : next
}

export function reachClimb(state: ClimbState, side: Side): ClimbState {
  if (state.status !== 'playing' || state.cooldown > 0 || state.boost) return state
  const target = routeRow(state.seed, state.step + 1, state.advancedFrom).find(hold => hold.side === side)
  if (!target) return miss(state, 'wrong')
  const progress = state.elapsed / state.budget
  if (progress < MIN_REACH) return miss(state, 'early')
  if (target.kind === 'loose') return {
    ...state, side, status: 'fallen', reason: 'broken', saves: 0, combo: 0,
    feedback: 'That hold had other plans. Cracked means crash.', event: state.event + 1,
  }
  const clean = isInTimingZone(progress, state.zone)
  const combo = clean ? state.combo + 1 : 0
  const gain = holdGain(target.kind)
  const height = Math.round((state.height + gain) * 10) / 10
  const introducing = state.advancedFrom === null && height >= ADVANCED_HEIGHT
  const advancedFrom = introducing ? state.step + 2 : state.advancedFrom
  const enteringSection = isThreeLaneRow(state.step + 2, advancedFrom) && !isThreeLaneRow(state.step + 1, advancedFrom)
  const next: ClimbState = {
    ...state, step: state.step + 1, side, kind: target.kind,
    height, advancedFrom,
    // Give each three-lane section a readable entrance, especially the first one.
    elapsed: 0, budget: Math.max(introducing ? 3200 : enteringSection ? 2400 : 0, holdTime(state.step + 1, target.kind)), cooldown: 160,
    combo, maxCombo: Math.max(combo, state.maxCombo), zone: adaptZone(state, clean, true),
    feedback: introducing ? '70 m. A new twist in the route.' : clean ? combo >= 3 ? `${combo} in a row. In the flow!` : 'Clean!' : progress > zoneBounds(state.zone).end ? 'Close, but hanging on.' : 'Got a grip.',
    lastMove: clean ? 'clean' : 'catch', event: state.event + 1,
    grips: state.grips + 1,
  }
  if (clean && target.powerup === 'energy') {
    // Defer the first three-lane section until after landing if this pickup crosses 70 m.
    const boost = planBoost({ ...next, advancedFrom: state.advancedFrom })
    return { ...next, advancedFrom: state.advancedFrom, boost, feedback: 'Dyno-Boost! Three holds, one leap.' }
  }
  return next
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
export const formatHeight = (height: number) => height.toLocaleString('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
