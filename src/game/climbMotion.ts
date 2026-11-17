import { BOOST_DURATION, BOOST_ROWS, isThreeLaneRow, type ClimbState, type Side } from './climber'

export type ClimbingPose = 'hang' | 'load' | 'reach' | 'catch' | 'slip' | 'boost' | 'fall' | 'hero'
export type ClimbMotion = {
  x: number; y: number; camera: number; pose: ClimbingPose; facing: number
  flight: number; chalk: number
}

export function laneX(side: Side | null, wide = false) {
  if (side === 'left') return wide ? 110 : 145
  if (side === 'right') return wide ? 330 : 295
  return 220
}

const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => n * n * (3 - 2 * n)
const handY = 373

// Coordinates refer to the leading hand. Camera travel, Tim and the timing arc
// all use the game clock, including when a browser pauses halfway through a move.
export function climbMotion(game: ClimbState, reduced: boolean): ClimbMotion {
  const column = (side: Side | null, row: number) => laneX(side, isThreeLaneRow(row, game.advancedFrom))
  const x = column(game.side, game.reason === 'broken' ? game.step + 1 : game.step)
  const from = column(game.previousSide, game.step - 1)
  const facing = Math.sign(x - from) || (game.side === 'left' ? -1 : 1)
  const still: ClimbMotion = { x, y: handY, camera: game.step, facing, pose: 'hang', flight: 0, chalk: 0 }
  if (game.status === 'fallen') return { ...still, pose: 'fall' }
  if (game.lastMove === 'slip') {
    if (game.elapsed > 380 || reduced) return still
    return { ...still, pose: 'slip' }
  }
  if (game.boost) {
    const t = game.boost.elapsed / BOOST_DURATION
    // First catch the bar at its real position before pushing off from it.
    if (!reduced && t < .17) return reachMotion(still, from, t / .17)
    const flight = smooth(clamp((t - .22) / .66))
    const endX = column(game.boost.side, game.boost.step)
    const pose = flight === 0 ? 'load' : flight === 1 ? 'catch' : 'boost'
    if (reduced) return { ...still, pose: 'boost', flight }
    return { x: x + (endX - x) * flight, y: handY - 68 * Math.sin(Math.PI * flight),
      camera: game.step + BOOST_ROWS * flight, facing: Math.sign(endX - x) || facing,
      flight, pose, chalk: Math.sin(Math.PI * flight) }
  }
  if (game.lastMove === 'boost') return { ...still, pose: game.elapsed < 160 && !reduced ? 'catch' : 'hang' }
  if (!game.step || reduced) return still
  return reachMotion(still, from, clamp(game.elapsed / 270))
}

function reachMotion(end: ClimbMotion, from: number, t: number): ClimbMotion {
  if (t >= 1) return end
  const reach = smooth(clamp((t - .14) / .60))
  const camera = smooth(clamp((t - .10) / .82))
  const pose = t < .20 ? 'load' : t < .72 ? 'reach' : 'catch'
  return { ...end, pose, x: from + (end.x - from) * reach, camera: end.camera - 1 + camera,
    y: handY + 100 * (camera - reach) - 12 * Math.sin(Math.PI * reach),
    chalk: t > .73 ? Math.sin(Math.PI * (t - .73) / .27) : 0 }
}
