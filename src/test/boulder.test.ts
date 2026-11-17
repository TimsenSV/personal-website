import { describe, expect, it, afterEach, vi } from 'vitest'
import { BEST_KEY, createClimb, holdTime, MIN_REACH, pauseClimb, PERFECT_END, PERFECT_START, reachClimb, readBest, resumeClimb, routeRow, saveBest, startClimb, tickClimb, type ClimbState, type Side } from '../game/climber'

const grip = (state: ClimbState, progress = .45, side: Side = routeRow(state.seed, state.step + 1)[0].side) => reachClimb(tickClimb(state, state.budget * progress), side)
afterEach(() => { localStorage.clear(); vi.restoreAllMocks() })

describe('endless climbing rules', () => {
  it('waits for a start and ignores input when not playing', () => {
    const ready = createClimb()
    expect(tickClimb(ready, 10000)).toBe(ready)
    expect(reachClimb(ready, 'left')).toBe(ready)
    const paused = pauseClimb(startClimb(9))
    expect(reachClimb(paused, 'left')).toBe(paused)
    expect(tickClimb(paused, 10000)).toBe(paused)
    expect(resumeClimb(paused).status).toBe('playing')
  })
  it('builds clean combos and records the largest combo', () => {
    let game = startClimb(42)
    for (let i = 0; i < 5; i++) game = grip(game)
    expect(game).toMatchObject({ step: 5, height: 9.6, combo: 5, maxCombo: 5, kind: 'jug', saves: 1 })
    game = grip(game, .85)
    expect(game).toMatchObject({ step: 6, combo: 0, maxCombo: 5, lastMove: 'catch' })
  })
  it('uses inclusive perfect boundaries and allows an early normal catch', () => {
    for (const progress of [PERFECT_START, PERFECT_END]) expect(grip(startClimb(1), progress).combo).toBe(1)
    expect(grip(startClimb(1), MIN_REACH).step).toBe(1)
    expect(grip(startClimb(1), MIN_REACH / 2)).toMatchObject({ step: 0, saves: 0, lastMove: 'slip' })
  })
  it('catches one mistake, ignores key spam during recovery, then falls', () => {
    const first = reachClimb(startClimb(1), 'right')
    expect(first).toMatchObject({ status: 'playing', saves: 0, step: 0 })
    expect(reachClimb(first, 'right')).toBe(first)
    const fallen = reachClimb(tickClimb(first, 700), 'right')
    expect(fallen).toMatchObject({ status: 'fallen', reason: 'wrong', height: 0 })
    expect(reachClimb(fallen, 'left')).toBe(fallen)
    expect(tickClimb(fallen, 1000)).toBe(fallen)
  })
  it('times out, gives one recovery, then lands on the mat', () => {
    let game = startClimb(1)
    game = tickClimb(game, game.budget)
    expect(game).toMatchObject({ saves: 0, status: 'playing', elapsed: 0 })
    game = tickClimb(game, game.budget)
    expect(game).toMatchObject({ status: 'fallen', reason: 'time' })
    expect(startClimb(2)).toMatchObject({ height: 0, combo: 0, saves: 1, elapsed: 0 })
  })
  it('makes excessive tapping cost the rescue instead of awarding free height', () => {
    const first = grip(startClimb(1))
    expect(reachClimb(first, 'right')).toBe(first)
    const rushed = reachClimb(tickClimb(first, 170), 'right')
    expect(rushed).toMatchObject({ step: 1, height: 2, saves: 0, lastMove: 'slip' })
  })
  it('keeps the difficulty bounded and gives rest holds more time', () => {
    expect(holdTime(30, 'normal')).toBeLessThan(holdTime(3, 'normal'))
    expect(holdTime(10000, 'normal')).toBe(1050)
    expect(holdTime(10000, 'crimp')).toBeGreaterThanOrEqual(700)
    expect(holdTime(30, 'jug')).toBeGreaterThan(holdTime(30, 'normal'))
    expect(holdTime(30, 'crimp')).toBeLessThan(holdTime(30, 'normal'))
  })
  it('produces reproducible, playable routes with forks and regular rests', () => {
    for (const seed of [1, 92, 2147483646]) {
      let game = startClimb(seed)
      for (let row = 1; row < 250; row++) {
        const choices = routeRow(seed, row)
        expect(choices).toEqual(routeRow(seed, row))
        expect(choices.length).toBeGreaterThan(0)
        expect(new Set(choices.map(item => item.side)).size).toBe(choices.length)
        game = grip(game)
        expect(game.status).toBe('playing')
      }
      expect(game.step).toBe(249)
      expect(routeRow(seed, 10).map(item => item.kind).sort()).toEqual(['crimp', 'jug'])
      expect(routeRow(seed, 17).some(item => item.kind === 'jug')).toBe(true)
    }
  })
  it('lets a fork trade time for height', () => {
    let game = startClimb(71)
    for (let i = 0; i < 9; i++) game = grip(game)
    const choices = routeRow(game.seed, 10)
    const safe = grip(game, .45, choices.find(hold => hold.kind === 'jug')!.side)
    const risky = grip(game, .45, choices.find(hold => hold.kind === 'crimp')!.side)
    expect(risky.height).toBeGreaterThan(safe.height)
    expect(risky.budget).toBeLessThan(safe.budget)
  })
  it('ignores invalid time deltas and freezes precisely when paused', () => {
    const game = tickClimb(startClimb(1), 900)
    for (const delta of [-1, 0, NaN, Infinity]) expect(tickClimb(game, delta)).toBe(game)
    const paused = pauseClimb(game)
    expect(resumeClimb(tickClimb(paused, 30000)).elapsed).toBe(900)
  })
})

describe('local personal best', () => {
  it('keeps the largest valid height across games', () => {
    saveBest(24.8); saveBest(2)
    expect(readBest()).toBe(24.8)
    saveBest(NaN); saveBest(Infinity); saveBest(-1)
    expect(readBest()).toBe(24.8)
  })
  it('recovers from corrupt or blocked browser storage', () => {
    for (const value of ['oops', '-5', 'Infinity', '10000001']) {
      localStorage.setItem(BEST_KEY, value)
      expect(readBest()).toBe(0)
    }
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked') })
    expect(readBest()).toBe(0)
    expect(() => saveBest(10)).not.toThrow()
  })
})
