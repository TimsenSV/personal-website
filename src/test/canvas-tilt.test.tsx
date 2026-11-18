import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCanvasTilt } from '../hooks/useCanvasTilt'

function Canvas({ children }: { children?: ReactNode }) {
  const ref = useCanvasTilt()
  return <main ref={ref}>{children ?? <section className="card" aria-label="Test card"><button>Open</button></section>}</main>
}
function move(target: Element, properties: Partial<PointerEvent> = {}) {
  const event = new Event('pointermove', { bubbles: true })
  Object.assign(event, { pointerType: 'mouse', clientX: 200, clientY: 0, buttons: 0, ...properties })
  fireEvent(target, event)
  act(() => vi.advanceTimersByTime(20))
}
let media: { matches: boolean; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> }
beforeEach(() => {
  vi.useFakeTimers()
  media = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }
  vi.stubGlobal('matchMedia', vi.fn(() => media))
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 200, height: 100 } as DOMRect)
})
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

describe('canvas pointer response', () => {
  it('bounds rotation and clears it before a click can measure a pop-out', () => {
    render(<Canvas/>)
    const card = screen.getByRole('region')
    move(card, { clientX: 400 })
    expect(card).toHaveAttribute('data-tilt-active')
    expect(card.style.getPropertyValue('--tilt-x')).toBe('4deg')
    expect(card.style.getPropertyValue('--tilt-y')).toBe('4deg')
    fireEvent.pointerDown(screen.getByRole('button'))
    expect(card).not.toHaveAttribute('data-tilt-active')
    expect(card).toHaveAttribute('data-tilt-reset')
    expect(card.style.getPropertyValue('--tilt-x')).toBe('')
  })
  it('tilts the two cards in a layout group independently', () => {
    render(<Canvas><div data-tilt-group>
      <section className="card" aria-label="Grip Happens"/>
      <section className="card" aria-label="Blog"><a href="./blog/">Read more</a></section>
    </div></Canvas>)
    const game = screen.getByRole('region', { name: 'Grip Happens' })
    const blog = screen.getByRole('region', { name: 'Blog' })
    const readMore = screen.getByRole('link', { name: 'Read more' })
    move(game)
    expect(game).toHaveAttribute('data-tilt-active')
    expect(blog).not.toHaveAttribute('data-tilt-active')
    move(readMore)
    expect(game).not.toHaveAttribute('data-tilt-active')
    expect(blog).toHaveAttribute('data-tilt-active')
    fireEvent.pointerDown(readMore)
    expect(blog).not.toHaveAttribute('data-tilt-active')
  })
  it('does not tilt for touch, dragging, reduced motion or an open dialog', () => {
    render(<Canvas/>)
    const card = screen.getByRole('region')
    move(card, { pointerType: 'touch' })
    expect(card).not.toHaveAttribute('data-tilt-active')
    move(card, { buttons: 1 })
    expect(card).not.toHaveAttribute('data-tilt-active')
    media.matches = false
    move(card)
    expect(card).not.toHaveAttribute('data-tilt-active')
    media.matches = true
    const dialog = document.createElement('dialog')
    dialog.open = true
    document.body.append(dialog)
    move(card)
    expect(card).not.toHaveAttribute('data-tilt-active')
    dialog.remove()
  })
  it('returns to rest on leave and cancels pending movement on cleanup', () => {
    const { unmount } = render(<Canvas/>)
    const card = screen.getByRole('region')
    move(card)
    fireEvent.pointerLeave(card.parentElement!)
    expect(card).not.toHaveAttribute('data-tilt-active')
    move(card)
    unmount()
    act(() => vi.advanceTimersByTime(20))
    expect(card).not.toHaveAttribute('data-tilt-active')
    expect(media.removeEventListener).toHaveBeenCalled()
  })
})
