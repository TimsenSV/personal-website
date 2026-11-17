import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BoulderGame } from '../components/BoulderGame'
import { ADVANCED_HEIGHT, BEST_KEY, isThreeLaneRow, reachClimb, routeRow, startClimb, tickClimb, type ClimbState, type Side } from '../game/climber'

const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })
const start = () => fireEvent.click(screen.getByRole('button', { name: 'Start climbing' }))
const board = () => screen.getByRole('group', { name: /Grip Happens/ })
const key = (value: string, repeat = false) => fireEvent.keyDown(board(), { key: value, repeat })
const keyFor = { left: 'ArrowLeft', center: 'ArrowUp', right: 'ArrowRight' }
const controlFor = { left: 'Reach left', center: 'Reach middle', right: 'Reach right' }
function move(game: ClimbState, side?: Side, input?: string | 'tap') {
  const target = side ?? routeRow(game.seed, game.step + 1, game.advancedFrom).find(hold => hold.kind !== 'loose')!.side
  advance(game.budget * .5)
  if (input === 'tap') fireEvent.click(screen.getByRole('button', { name: controlFor[target] }))
  else key(input ?? keyFor[target])
  return reachClimb(tickClimb(game, game.budget * .5), target)
}
function reachAdvanced() {
  vi.spyOn(Math, 'random').mockReturnValue(93 / 0x7fffffff)
  render(<BoulderGame/>); start()
  let game = startClimb(93)
  while (game.height < ADVANCED_HEIGHT) {
    expect(screen.queryByRole('button', { name: 'Reach middle' })).not.toBeInTheDocument()
    game = move(game)
  }
  return game
}

beforeEach(() => { vi.useFakeTimers(); localStorage.clear() })
afterEach(() => { vi.useRealTimers(); localStorage.clear() })

describe('endless climber controls', () => {
  it('starts with Enter or Space and ignores key repeats after starting', () => {
    const view = render(<BoulderGame/>)
    key('Enter')
    expect(board()).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Start climbing' })).not.toBeInTheDocument()
    view.unmount()
    render(<BoulderGame/>)
    key(' ')
    key(' ', true)
    expect(screen.getByRole('button', { name: 'Pause game' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Keep climbing' })).not.toBeInTheDocument()
  })
  it('renders the same adaptive timing boundaries used by the game', () => {
    const { container } = render(<BoulderGame/>)
    start()
    const zone = container.querySelector<SVGPathElement>('.climb-arc-zone')!
    const initialOffset = zone.getAttribute('stroke-dashoffset')
    const width = () => parseFloat(zone.getAttribute('stroke-dasharray')!)
    const initialWidth = width()
    expect(initialWidth).toBeCloseTo(30)
    expect(Number(initialOffset)).toBeCloseTo(-30)
    advance(1200); key('ArrowLeft')
    expect(width()).toBeGreaterThan(initialWidth)
    expect(zone.getAttribute('stroke-dashoffset')).not.toBe(initialOffset)
    const wider = width()
    advance(350); key('ArrowRight')
    expect(width()).toBeLessThan(wider)
  })
  it('keeps the timing cue next to Tim, highlights the blue zone and freezes on pause', () => {
    const { container } = render(<BoulderGame/>)
    start()
    const arc = container.querySelector('.climb-timing-arc')!
    const position = arc.querySelector<SVGGElement>('.climb-tim-position')!
    const cursor = arc.querySelector('circle')!
    expect(arc.querySelector('text')).toBeNull()
    expect(position.style.transform).toBe('translate(220px, 373px)')
    advance(1200)
    expect(arc).toHaveClass('is-perfect')
    key('ArrowLeft')
    expect(position.style.transform).toBe('translate(145px, 373px)')
    expect(arc).not.toHaveClass('is-perfect')
    advance(850)
    key('p')
    const pausedX = cursor.getAttribute('cx')
    advance(5000)
    expect(cursor.getAttribute('cx')).toBe(pausedX)
    fireEvent.click(screen.getByRole('button', { name: 'Keep climbing' }))
    key('ArrowRight')
    expect(position.style.transform).toBe('translate(295px, 373px)')
  })
  it('unlocks the middle at 70 metres, supports Up/W/touch and ends a run on a cracked hold', () => {
    let game = reachAdvanced()
    expect(screen.getByRole('button', { name: 'Reach middle' })).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Arrow Up or W for the middle')
    expect(screen.getByRole('status')).toHaveTextContent('cracked hold')
    for (const input of ['ArrowUp', 'w', 'tap']) {
      while (!routeRow(game.seed, game.step + 1, game.advancedFrom).some(hold => hold.side === 'center' && hold.kind !== 'loose')) game = move(game)
      game = move(game, 'center', input)
      expect(board()).toHaveFocus()
      expect(screen.getByRole('button', { name: 'Pause game' })).toBeEnabled()
      expect(screen.getByRole('status')).toHaveTextContent('2 of 2 lives')
    }
    while (!isThreeLaneRow(game.step + 1, game.advancedFrom)) game = move(game)
    const trap = routeRow(game.seed, game.step + 1, game.advancedFrom).find(hold => hold.kind === 'loose')!
    move(game, trap.side, 'tap')
    expect(screen.getByRole('button', { name: 'Chalk up again' })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Cracked means crash')
    expect(screen.getByRole('img', { name: '0 of 2 lives' })).toBeVisible()
    expect(Number(localStorage.getItem(BEST_KEY))).toBe(game.height)
    key('Enter')
    expect(screen.queryByRole('button', { name: 'Reach middle' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Next hold: left')
  })
  it('only shows the middle control during the short three-lane sections', () => {
    let game = reachAdvanced()
    for (let index = 0; index < 4; index++) {
      expect(screen.getByRole('button', { name: 'Reach middle' })).toBeEnabled()
      game = move(game)
    }
    expect(screen.queryByRole('button', { name: 'Reach middle' })).not.toBeInTheDocument()
    const height = game.height
    key('ArrowUp'); key('w')
    expect(screen.getByRole('status')).toHaveTextContent('2 of 2 lives')
    expect(Number(localStorage.getItem(BEST_KEY))).toBe(height)
    for (let index = 0; index < 8; index++) {
      expect(screen.queryByRole('button', { name: 'Reach middle' })).not.toBeInTheDocument()
      game = move(game)
    }
    expect(screen.getByRole('button', { name: 'Reach middle' })).toBeEnabled()
  })
  it('waits to start, accepts arrow keys and ignores held keys', () => {
    render(<BoulderGame/>)
    advance(20000)
    expect(screen.getByRole('button', { name: 'Start climbing' })).toBeVisible()
    start()
    expect(board()).toHaveFocus()
    advance(1200); key('ArrowLeft', true)
    expect(screen.getByRole('status')).toHaveTextContent('Next hold: left')
    key('ArrowLeft')
    expect(screen.getByRole('status')).toHaveTextContent('Next hold: right')
    expect(screen.getByRole('status')).toHaveTextContent('Clean')
    expect(localStorage.getItem(BEST_KEY)).toBe('2')
    advance(850); key('d')
    expect(localStorage.getItem(BEST_KEY)).toBe('4')
  })
  it('supports tapping both halves, loss and immediate restart', () => {
    render(<BoulderGame/>); start()
    expect(screen.getByRole('img', { name: '2 of 2 lives' })).toBeVisible()
    advance(1200); fireEvent.click(screen.getByRole('button', { name: 'Reach left' }))
    advance(850); fireEvent.click(screen.getByRole('button', { name: 'Reach right' }))
    advance(400); fireEvent.click(screen.getByRole('button', { name: 'Reach right' }))
    expect(screen.getByRole('status')).toHaveTextContent('Caught yourself')
    expect(screen.getByRole('img', { name: '1 of 2 lives' })).toBeVisible()
    advance(500); fireEvent.click(screen.getByRole('button', { name: 'Reach right' }))
    const restart = screen.getByRole('button', { name: 'Chalk up again' })
    expect(restart).toHaveFocus()
    expect(screen.getByRole('img', { name: '0 of 2 lives' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('4.0 metres')
    key('Enter')
    expect(screen.getByRole('img', { name: '2 of 2 lives' })).toBeVisible()
    expect(board()).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Next hold: left')
    expect(localStorage.getItem(BEST_KEY)).toBe('4')
  })
  it('pauses for manual pause, focus loss and hidden tabs; resumes only explicitly', () => {
    render(<BoulderGame/>); start(); advance(1000)
    fireEvent.click(screen.getByRole('button', { name: 'Pause game' }))
    advance(30000)
    expect(screen.getByRole('button', { name: 'Keep climbing' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Keep climbing' }))
    key('ArrowLeft')
    expect(screen.getByRole('status')).toHaveTextContent('Clean')
    fireEvent(window, new Event('blur'))
    expect(screen.getByRole('button', { name: 'Keep climbing' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Keep climbing' }))
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    expect(screen.getByRole('status')).toHaveTextContent('paused')
  })
  it('pauses when tabbing away, supports P and does not consume modified keys', () => {
    render(<BoulderGame/>); start(); advance(1000)
    fireEvent.keyDown(board(), { key: 'ArrowLeft', ctrlKey: true })
    expect(screen.getByRole('status')).toHaveTextContent('Next hold: left')
    key('p')
    expect(screen.getByRole('button', { name: 'Keep climbing' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Keep climbing' }))
    key('Tab')
    expect(screen.getByRole('status')).toHaveTextContent('paused')
    expect(screen.getByRole('button', { name: 'Keep climbing' })).toHaveFocus()
  })
  it('times out without input and cancels its animation loop when closed', () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const { unmount } = render(<BoulderGame/>); start()
    advance(3300)
    expect(screen.getByRole('status')).toHaveTextContent('Caught yourself')
    advance(3300)
    expect(screen.getByRole('button', { name: 'Chalk up again' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Chalk up again' }))
    unmount()
    expect(cancel).toHaveBeenCalled()
    advance(30000)
  })
})
