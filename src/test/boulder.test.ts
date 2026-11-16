import { describe, expect, it } from 'vitest'
import { createGame, isReachable, MAX_MOVES, moveTo } from '../game/boulder'

describe('the boulder problem', () => {
  it('can be solved in five moves', () => {
    const result = ['a', 'b', 'c', 'd', 'top'].reduce(moveTo, createGame())
    expect(result.status).toBe('won')
    expect(result.remaining).toBe(2)
  })
  it('does not spend energy on unreachable or unknown holds', () => {
    for (const target of ['top', 'missing', 'start']) {
      expect(moveTo(createGame(), target).remaining).toBe(MAX_MOVES)
      expect(moveTo(createGame(), target).path).toEqual(['start'])
    }
  })
  it('does not allow shortcuts that skip the route or jump from the detour to the top', () => {
    for (const [from, to] of [['start', 'b'], ['a', 'c'], ['c', 'top'], ['e', 'c'], ['e', 'd']]) {
      expect(isReachable(from, to)).toBe(false)
    }
  })
  it('allows a detour and a win on the very last move', () => {
    const result = ['a', 'e', 'a', 'b', 'c', 'd', 'top'].reduce(moveTo, createGame())
    expect(result.status).toBe('won')
    expect(result.remaining).toBe(0)
  })
  it('ends when the moves run out and ignores further moves', () => {
    const result = ['a', 'start', 'a', 'start', 'a', 'start', 'a'].reduce(moveTo, createGame())
    expect(result.status).toBe('lost')
    expect(moveTo(result, 'b')).toBe(result)
    expect(createGame()).toEqual({ path: ['start'], remaining: MAX_MOVES, status: 'playing', message: expect.any(String) })
  })
})
