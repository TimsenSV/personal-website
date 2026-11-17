import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProjectBook } from '../components/ProjectBook'
import { ClimbBackdrop } from '../components/ClimbBackdrop'
import { siteConfig } from '../content/site'
import { BoulderWidget, MusicWidget, RunningWidget } from '../components/Widgets'

function media(matches: boolean) {
  const events = new EventTarget()
  return { matches, addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events) }
}
let touch: ReturnType<typeof media>
let reduced: ReturnType<typeof media>
let enter: (visible: boolean) => void
const disconnect = vi.fn()
const observe = vi.fn()
beforeEach(() => {
  touch = media(true); reduced = media(false)
  disconnect.mockClear(); observe.mockClear()
  vi.stubGlobal('matchMedia', vi.fn((query: string) => query.includes('prefers-reduced-motion') ? reduced : touch))
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) {
      enter = visible => callback([{ isIntersecting: visible, intersectionRatio: visible ? .8 : 0 } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
    }
    observe = observe
    disconnect = disconnect
  })
})

describe('scroll previews and optional game scenery', () => {
  it('activates the vinyl in the reading area without opening a player', () => {
    const open = vi.fn()
    render(<MusicWidget config={siteConfig.spotify} onOpen={open}/>)
    const record = screen.getByRole('button', { name: 'Open playlist' })
    act(() => enter(true))
    expect(record).toHaveAttribute('data-scroll-active')
    expect(open).not.toHaveBeenCalled()
    act(() => enter(false))
    expect(record).not.toHaveAttribute('data-scroll-active')
  })
  it.each(['runner', 'climber'])('activates %s while visible and stops in hidden tabs', character => {
    const { container } = render(character === 'runner' ? <RunningWidget config={siteConfig.running} onOpen={() => undefined}/> : <BoulderWidget onOpen={() => undefined}/>)
    const card = container.querySelector('section')!
    act(() => enter(true))
    expect(card).toHaveAttribute('data-scroll-active')
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    act(() => enter(true))
    expect(card).not.toHaveAttribute('data-scroll-active')
    hidden.mockRestore()
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    act(() => enter(true))
    expect(card).toHaveAttribute('data-scroll-active')
    act(() => { reduced.matches = true; reduced.dispatchEvent(new Event('change')) })
    act(() => enter(true))
    expect(card).not.toHaveAttribute('data-scroll-active')
  })
  it('reveals a mobile project in the reading area, resets on exit and cleans up', () => {
    const { unmount } = render(<ProjectBook product={siteConfig.products[0]} onOpen={() => undefined}/>)
    const book = screen.getByRole('button', { name: 'shopvibes: open details' })
    expect(observe).toHaveBeenCalledWith(book)
    act(() => enter(true))
    expect(book).toHaveAttribute('data-scroll-active')
    act(() => enter(false))
    expect(book).not.toHaveAttribute('data-scroll-active')
    act(() => enter(true)); unmount()
    expect(disconnect).toHaveBeenCalled()
    expect(book).not.toHaveAttribute('data-scroll-active')
  })
  it('uses pointer hover on desktop and switches off scroll motion when requested', () => {
    touch.matches = false
    render(<ProjectBook product={siteConfig.products[0]} onOpen={() => undefined}/>)
    const book = screen.getByRole('button')
    expect(observe).not.toHaveBeenCalled()
    act(() => { touch.matches = true; touch.dispatchEvent(new Event('change')) })
    act(() => enter(true))
    expect(book).toHaveAttribute('data-scroll-active')
    act(() => { reduced.matches = true; reduced.dispatchEvent(new Event('change')) })
    act(() => enter(true))
    expect(book).not.toHaveAttribute('data-scroll-active')
    expect(disconnect).toHaveBeenCalled()
  })
  it('keeps parallax tied to completed holds and stops scenery movement for reduced motion', () => {
    const { container, rerender } = render(<ClimbBackdrop step={0}/>)
    const tile = container.querySelector<SVGGElement>('[data-depth="far"] > g:nth-child(2)')!
    const initial = tile.style.transform
    rerender(<ClimbBackdrop step={3}/>)
    expect(tile.style.transform).not.toBe(initial)
    const afterMove = tile.style.transform
    rerender(<ClimbBackdrop step={3}/>)
    expect(tile.style.transform).toBe(afterMove)
    act(() => { reduced.matches = true; reduced.dispatchEvent(new Event('change')) })
    expect(tile.style.transform).toBe(initial)
    rerender(<ClimbBackdrop step={30}/>)
    expect(tile.style.transform).toBe(initial)
    expect(container.querySelectorAll('.climb-parallax-tile')).toHaveLength(12)
  })
})
