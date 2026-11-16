import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhotoCarousel } from '../components/PhotoCarousel'
import type { ProfilePhoto } from '../content/site'

const photos: ProfilePhoto[] = [
  { src: 'one.jpg', alt: 'Erstes Testfoto', caption: 'Eins' },
  { src: 'two.jpg', alt: 'Zweites Testfoto', caption: 'Zwei' },
  { src: 'three.jpg', alt: 'Drittes Testfoto', placeholder: true },
]
const finishFlip = () => act(() => vi.advanceTimersByTime(400))
const status = () => screen.getByRole('status').textContent
const pointer = (x: number, y = 100) => ({ pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, clientX: x, clientY: y })

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

describe('polaroid photo carousel', () => {
  it('cycles with click and arrows, keeps focus, and ignores repeated clicks during a flip', () => {
    vi.useFakeTimers()
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Fotos durchblättern' })
    photo.focus()
    fireEvent.click(photo)
    expect(status()).toBe('Foto 2 von 3')
    fireEvent.click(photo)
    expect(status()).toBe('Foto 2 von 3')
    finishFlip()
    expect(photo).toHaveFocus()
    fireEvent.keyDown(photo, { key: 'ArrowRight' })
    expect(status()).toBe('Foto 3 von 3 · Platzhalter')
    finishFlip()
    fireEvent.click(screen.getByRole('button', { name: 'Nächstes Foto' }))
    expect(status()).toBe('Foto 1 von 3')
    finishFlip()
    fireEvent.keyDown(photo, { key: 'ArrowLeft' })
    expect(status()).toBe('Foto 3 von 3 · Platzhalter')
  })

  it('drags in either direction and consumes the click generated after a drag', () => {
    vi.useFakeTimers()
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Fotos durchblättern' })
    vi.spyOn(photo, 'clientWidth', 'get').mockReturnValue(200)
    fireEvent.pointerDown(photo, pointer(160))
    fireEvent.pointerMove(photo, pointer(60))
    expect(photo.style.getPropertyValue('--drag-x')).toBe('-100px')
    fireEvent.pointerUp(photo, pointer(60))
    expect(status()).toBe('Foto 2 von 3')
    finishFlip()
    fireEvent.click(photo, { detail: 1 })
    expect(status()).toBe('Foto 2 von 3')
    fireEvent.pointerDown(photo, pointer(60))
    fireEvent.pointerMove(photo, pointer(160))
    fireEvent.pointerUp(photo, pointer(160))
    expect(status()).toBe('Foto 1 von 3')
  })

  it('snaps short drags back and allows vertical scrolling or cancellation without changing photos', () => {
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Fotos durchblättern' })
    vi.spyOn(photo, 'clientWidth', 'get').mockReturnValue(200)
    fireEvent.pointerDown(photo, pointer(100))
    fireEvent.pointerMove(photo, pointer(125))
    fireEvent.pointerUp(photo, pointer(125))
    fireEvent.click(photo, { detail: 1 })
    expect(status()).toBe('Foto 1 von 3')
    expect(photo.style.getPropertyValue('--drag-x')).toBe('0px')
    fireEvent.pointerDown(photo, pointer(100))
    fireEvent.pointerMove(photo, pointer(110, 180))
    fireEvent.pointerCancel(photo, pointer(110, 180))
    expect(status()).toBe('Foto 1 von 3')
    fireEvent.pointerDown(photo, pointer(140))
    fireEvent.pointerMove(photo, pointer(40))
    fireEvent.pointerCancel(photo, pointer(40))
    expect(status()).toBe('Foto 1 von 3')
    expect(photo.style.getPropertyValue('--drag-x')).toBe('0px')
  })

  it('switches immediately without movement when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Fotos durchblättern' })
    fireEvent.keyDown(photo, { key: 'ArrowRight' })
    fireEvent.keyDown(photo, { key: 'ArrowRight' })
    expect(status()).toBe('Foto 3 von 3 · Platzhalter')
    expect(document.querySelector('.photo-departing')).toBeNull()
  })

  it('handles missing photos, a single photo and failed image loads honestly', () => {
    const view = render(<PhotoCarousel photos={[]} name="Tim"/>)
    expect(screen.getByRole('img', { name: 'Platz für persönliche Fotos' })).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    view.rerender(<PhotoCarousel photos={photos.slice(0, 1)} name="Tim"/>)
    expect(screen.getByRole('button', { name: 'Fotos durchblättern' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Nächstes Foto' })).not.toBeInTheDocument()
    fireEvent.error(screen.getByRole('img', { name: 'Erstes Testfoto' }))
    expect(screen.getByText('Foto nicht verfügbar')).toBeVisible()
  })

  it('cancels a pending flip timer when removed', () => {
    vi.useFakeTimers()
    const view = render(<PhotoCarousel photos={photos} name="Tim"/>)
    fireEvent.click(screen.getByRole('button', { name: 'Fotos durchblättern' }))
    expect(vi.getTimerCount()).toBe(1)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
