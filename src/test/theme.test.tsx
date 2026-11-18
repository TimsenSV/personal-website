import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useColorTheme } from '../hooks/useColorTheme'

function Switch() {
  const theme = useColorTheme()
  return <button aria-pressed={theme.dark} onClick={event => theme.toggle(event.currentTarget)}>Dark mode</button>
}
function renderSwitch() {
  render(<Switch/>)
  return screen.getByRole('button', { name: 'Dark mode' })
}
function pending() {
  let resolve!: () => void
  const promise = new Promise<void>(done => { resolve = done })
  return { promise, resolve }
}

afterEach(() => {
  localStorage.removeItem('timsen-theme')
  delete document.documentElement.dataset.theme
  Reflect.deleteProperty(document, 'startViewTransition')
  Reflect.deleteProperty(document, 'getAnimations')
})

describe('dock theme', () => {
  it('honours system appearance, remembers an explicit choice, and skips the wave for reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    const start = vi.fn()
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start })
    const button = renderSwitch()
    expect(button).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(button)
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(localStorage.getItem('timsen-theme')).toBe('light')
    expect(start).not.toHaveBeenCalled()
    localStorage.setItem('timsen-theme', 'dark')
    fireEvent(window, new StorageEvent('storage', { key: 'timsen-theme' }))
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps working when a browser blocks preference storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Unavailable') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Unavailable') })
    const button = renderSwitch()
    fireEvent.click(button)
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    fireEvent.click(button)
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('reverses the same wave at the button and commits the last choice before removing snapshots', async () => {
    const finish = pending()
    const ready = pending()
    const animation = { animationName: 'dock-theme-wave', finished: finish.promise, playState: 'running', updatePlaybackRate: vi.fn() }
    const start = vi.fn((paint: () => void) => {
      paint()
      return { ready: ready.promise, finished: finish.promise, skipTransition: finish.resolve }
    })
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start })
    Object.defineProperty(document, 'getAnimations', { configurable: true, value: () => [animation] })
    const button = renderSwitch()
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(new DOMRect(50, 400, 44, 44))
    fireEvent.click(button)
    await act(async () => ready.resolve())
    fireEvent.click(document.documentElement, { clientX: 15, clientY: 15 })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(document.documentElement, { clientX: 72, clientY: 422 })
    expect(animation.updatePlaybackRate).toHaveBeenLastCalledWith(-1)
    expect(start).toHaveBeenCalledTimes(1)
    await act(async () => finish.resolve())
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).not.toHaveAttribute('data-theme-wave')
    expect(document.head.textContent).not.toContain('@keyframes dock-theme-wave')
  })
})
