import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PullRegister } from '../components/PullRegister'

function setup() {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
  const open = vi.fn()
  render(<div className="intro-desk"><PullRegister onOpen={open}/></div>)
  const button = screen.getByRole('button', { name: 'Open CV' })
  button.setPointerCapture = vi.fn()
  button.hasPointerCapture = () => false
  const touch = (x: number, y = 0) => ({ pointerId: 1, isPrimary: true, pointerType: 'touch', clientX: x, clientY: y, button: 0 })
  fireEvent.pointerDown(button, touch(0))
  return { button, open, touch }
}

describe('CV register with reduced motion', () => {
  it('allows someone to change their mind even after crossing the release point', () => {
    const { button, open, touch } = setup()
    fireEvent.pointerMove(button, touch(45))
    expect(button.dataset.ready).toBe('true')
    fireEvent.pointerMove(button, touch(12))
    fireEvent.pointerUp(button, touch(12))
    fireEvent.click(button, { detail: 1 })
    expect(open).not.toHaveBeenCalled()
    expect(button.style.getPropertyValue('--travel-x')).toBe('0px')
  })
  it('opens exactly once when a full touch pull is released', () => {
    const { button, open, touch } = setup()
    fireEvent.pointerMove(button, touch(45))
    expect(open).not.toHaveBeenCalled()
    fireEvent.pointerUp(button, touch(45))
    fireEvent.click(button, { detail: 1 })
    expect(open).toHaveBeenCalledTimes(1)
  })
  it.each([true, false])('opens the CV during the loop with Tim at the grip: %s', atGrip => {
    const { button, open, touch } = setup()
    button.querySelector<SVGElement>('.register-tim')!.style.setProperty('--at-grip', atGrip ? '1' : '0')
    fireEvent.pointerMove(button, touch(45))
    expect(button.hasAttribute('data-tim-riding')).toBe(atGrip)
    fireEvent.pointerUp(button, touch(45))
    expect(open).toHaveBeenCalledTimes(1)
    expect(button).not.toHaveAttribute('data-tim-riding')
  })
  it('leaves vertical scrolling, cancelled touches and subsequent taps usable', () => {
    const { button, open, touch } = setup()
    fireEvent.pointerMove(button, touch(12, 40))
    fireEvent.pointerCancel(button, touch(12, 40))
    fireEvent.click(button, { detail: 1 })
    expect(open).not.toHaveBeenCalled()
    fireEvent.pointerDown(button, touch(0))
    fireEvent.pointerUp(button, touch(0))
    fireEvent.click(button, { detail: 1 })
    expect(open).toHaveBeenCalledTimes(1)
  })
})
