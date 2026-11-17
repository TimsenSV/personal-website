import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BOOST_DURATION, BOOST_ROWS, climbReducer, pauseClimb, reachClimb, resumeClimb, routeRow, startClimb, tickClimb, type ClimbState } from '../game/climber'
import { BoulderGame } from '../components/BoulderGame'

function beforeBar(seed = 42) {
  let game = startClimb(seed)
  while (!routeRow(seed, game.step + 1).some(hold => hold.powerup)) {
    const target = routeRow(seed, game.step + 1)[0]
    game = reachClimb(tickClimb(game, game.budget * .95), target.side)
  }
  return game
}
function collect(game: ClimbState, progress = game.zone.center) {
  const bar = routeRow(game.seed, game.step + 1, game.advancedFrom).find(hold => hold.powerup)!
  return reachClimb(tickClimb(game, game.budget * progress), bar.side)
}
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); localStorage.clear() })

describe('energy bar and Dyno-Boost', () => {
  it('places one deterministic bar on a safe hold in each spaced interval', () => {
    for (const seed of [1, 42, 999]) {
      let last = -10
      let total = 0
      for (let row = 1; row < 180; row++) {
        const holds = routeRow(seed, row, 35)
        expect(holds).toEqual(routeRow(seed, row, 35))
        const bars = holds.filter(hold => hold.powerup)
        expect(bars.length).toBeLessThanOrEqual(1)
        if (bars.length) {
          expect(bars[0].kind).not.toBe('loose')
          expect(row - last).toBeGreaterThanOrEqual(15)
          expect(row).toBeGreaterThanOrEqual(12)
          last = row; total++
        }
      }
      expect(total).toBe(10)
    }
  })
  it('requires clean timing and ignores repeated inputs during the flight', () => {
    const game = beforeBar()
    expect(collect(game, .95).boost).toBeNull()
    const boosted = collect(game)
    expect(boosted.boost).not.toBeNull()
    expect(boosted.combo).toBe(game.combo + 1)
    for (const side of ['left', 'center', 'right'] as const) expect(reachClimb(boosted, side)).toBe(boosted)
    expect(tickClimb(boosted, 300).elapsed).toBe(0)
  })
  it('skips exactly three rows, counts their height but not extra grips or combo', () => {
    const boosted = collect(beforeBar())
    const target = boosted.boost!
    const halfway = tickClimb(boosted, BOOST_DURATION / 2)
    expect(halfway.height).toBe(boosted.height)
    const landed = tickClimb(halfway, 10000)
    expect(landed).toMatchObject({ status: 'playing', boost: null, step: boosted.step + BOOST_ROWS,
      height: target.height, combo: boosted.combo, grips: boosted.grips, saves: boosted.saves, elapsed: 0 })
    expect(landed.height).toBeGreaterThan(boosted.height)
    expect(routeRow(landed.seed, landed.step, landed.advancedFrom).find(hold => hold.side === landed.side)?.kind).not.toBe('loose')
    expect(landed.budget).toBeGreaterThanOrEqual(2400)
  })
  it('freezes and resumes the exact flight, and clears it on restart', () => {
    const flying = tickClimb(collect(beforeBar()), 400)
    const paused = pauseClimb(flying)
    expect(tickClimb(paused, 30000)).toBe(paused)
    expect(resumeClimb(paused).boost).toEqual(flying.boost)
    expect(tickClimb(resumeClimb(paused), BOOST_DURATION - 400).boost).toBeNull()
    expect(climbReducer(paused, { type: 'start', seed: 8 })).toMatchObject({ height: 0, boost: null, grips: 0 })
  })
  it('introduces three lanes after a boost crossing 70 m and lands safely across existing sections', () => {
    for (const advancedFrom of [null, 3, 10, 13]) {
      const game = { ...beforeBar(), height: 69, advancedFrom }
      const boosted = collect(game)
      const landed = tickClimb(boosted, BOOST_DURATION)
      expect(landed.height).toBeGreaterThan(70)
      expect(landed.budget).toBeGreaterThanOrEqual(advancedFrom === null ? 3200 : 2400)
      expect(routeRow(landed.seed, landed.step, landed.advancedFrom).find(hold => hold.side === landed.side)?.kind).not.toBe('loose')
      if (advancedFrom === null) expect(landed.advancedFrom).toBe(landed.step + 1)
    }
  })
  it('shows only the poster before start, then groups the record with height', () => {
    const { container } = render(<BoulderGame/>)
    expect(screen.getByRole('heading', { name: 'Grip Happens' })).toBeVisible()
    expect(container.querySelector('.climb-hud')).toBeNull()
    expect(container.querySelector('.climb-wall')).toBeNull()
    expect(screen.getAllByRole('button')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Start climbing' }))
    expect(container.querySelector('.climb-altitude')).toHaveTextContent('HEIGHT0.0 mBEST')
    expect(screen.queryByText('LIVES')).toBeNull()
    expect(screen.getByRole('img', { name: '2 of 2 lives' })).toBeVisible()
  })
  it('animates the displayed height, suspends timing and restores control after a collected bar', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(42 / 0x7fffffff)
    const { container, unmount } = render(<BoulderGame/>)
    fireEvent.click(screen.getByRole('button', { name: 'Start climbing' }))
    let game = startClimb(42)
    const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms))
    while (!routeRow(game.seed, game.step + 1).some(hold => hold.powerup)) {
      const hold = routeRow(game.seed, game.step + 1)[0]
      advance(game.budget * .95)
      fireEvent.click(screen.getByRole('button', { name: `Reach ${hold.side}` }))
      game = reachClimb(tickClimb(game, game.budget * .95), hold.side)
    }
    const bar = routeRow(game.seed, game.step + 1).find(hold => hold.powerup)!
    advance(game.budget * game.zone.center)
    fireEvent.click(screen.getByRole('button', { name: `Reach ${bar.side}` }))
    expect(screen.getByRole('status')).toHaveTextContent('Dyno-Boost')
    expect(container.querySelector('.pose-boost')).not.toBeNull()
    expect(container.querySelector('.climb-timing-arc')).toBeNull()
    const counter = container.querySelector('.climb-height strong')!
    const initial = parseFloat(counter.textContent!)
    advance(400)
    expect(parseFloat(counter.textContent!)).toBeGreaterThan(initial)
    fireEvent(window, new Event('blur'))
    const paused = counter.textContent
    advance(5000)
    expect(counter.textContent).toBe(paused)
    fireEvent.click(screen.getByRole('button', { name: 'Keep climbing' }))
    advance(750)
    expect(container.querySelector('.climb-boost-banner')).toBeNull()
    expect(container.querySelector('.climb-timing-arc')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Reach left' })).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Stuck the landing')
    unmount()
  })
})
