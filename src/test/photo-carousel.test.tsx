import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhotoCarousel } from '../components/PhotoCarousel'
import type { ProfilePhoto } from '../content/site'

const photos: ProfilePhoto[] = [
  { src: 'one.jpg', alt: 'Erstes Testfoto', caption: 'Eins' },
  { src: 'two.jpg', alt: 'Zweites Testfoto', caption: 'Zwei' },
  { src: 'three.jpg', alt: 'Drittes Testfoto', placeholder: true },
]
const finishFlip = () => act(() => vi.advanceTimersByTime(400))
const status = () => {
  const dialog = screen.queryByRole('dialog')
  return (dialog ? within(dialog) : screen).getByRole('status').textContent
}
const pointer = (x: number, y = 100) => ({ pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, clientX: x, clientY: y })

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

describe('polaroid photo carousel', () => {
  it('enlarges on click, cycles with click and arrows, then keeps the selected photo and returns focus', () => {
    vi.useFakeTimers()
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const trigger = screen.getByRole('button', { name: 'Enlarge photos' })
    const originalImage = within(trigger).getByRole('img')
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Photos of Tim' })
    const photo = within(dialog).getByRole('button', { name: 'Browse photos' })
    expect(photo).toBe(trigger)
    expect(within(photo).getByRole('img')).toBe(originalImage)
    expect(document.querySelectorAll('.photo-carousel')).toHaveLength(1)
    expect(photo).toHaveFocus()
    expect(status()).toBe('Photo 1 of 3')
    expect(document.body.style.overflow).toBe('hidden')
    const close = within(dialog).getByRole('button', { name: 'Close photo gallery' })
    const next = within(dialog).getByRole('button', { name: 'Next photo' })
    close.focus()
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true })
    expect(next).toHaveFocus()
    fireEvent.keyDown(next, { key: 'Tab' })
    expect(close).toHaveFocus()
    photo.focus()
    fireEvent.click(photo)
    expect(status()).toBe('Photo 2 of 3')
    fireEvent.click(photo)
    expect(status()).toBe('Photo 2 of 3')
    finishFlip()
    expect(photo).toHaveFocus()
    fireEvent.keyDown(photo, { key: 'ArrowRight' })
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    finishFlip()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next photo' }))
    expect(status()).toBe('Photo 1 of 3')
    finishFlip()
    fireEvent.keyDown(photo, { key: 'ArrowLeft' })
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close photo gallery' }))
    finishFlip()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('drags in either direction and consumes the click generated after a drag', () => {
    vi.useFakeTimers()
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Enlarge photos' })
    vi.spyOn(photo, 'clientWidth', 'get').mockReturnValue(200)
    fireEvent.pointerDown(photo, pointer(160))
    fireEvent.pointerMove(photo, pointer(60))
    expect(photo.style.getPropertyValue('--drag-x')).toBe('-100px')
    fireEvent.pointerUp(photo, pointer(60))
    expect(status()).toBe('Photo 2 of 3')
    finishFlip()
    fireEvent.click(photo, { detail: 1 })
    expect(status()).toBe('Photo 2 of 3')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.pointerDown(photo, pointer(60))
    fireEvent.pointerMove(photo, pointer(160))
    fireEvent.pointerUp(photo, pointer(160))
    expect(status()).toBe('Photo 1 of 3')
  })

  it('snaps short drags back and allows vertical scrolling or cancellation without changing photos', () => {
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Enlarge photos' })
    vi.spyOn(photo, 'clientWidth', 'get').mockReturnValue(200)
    fireEvent.pointerDown(photo, pointer(100))
    fireEvent.pointerMove(photo, pointer(125))
    fireEvent.pointerUp(photo, pointer(125))
    fireEvent.click(photo, { detail: 1 })
    expect(status()).toBe('Photo 1 of 3')
    expect(photo.style.getPropertyValue('--drag-x')).toBe('0px')
    fireEvent.pointerDown(photo, pointer(100))
    fireEvent.pointerMove(photo, pointer(110, 180))
    fireEvent.pointerCancel(photo, pointer(110, 180))
    expect(status()).toBe('Photo 1 of 3')
    fireEvent.pointerDown(photo, pointer(140))
    fireEvent.pointerMove(photo, pointer(40))
    fireEvent.pointerCancel(photo, pointer(40))
    expect(status()).toBe('Photo 1 of 3')
    expect(photo.style.getPropertyValue('--drag-x')).toBe('0px')
  })

  it('switches immediately without movement when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    const photo = screen.getByRole('button', { name: 'Enlarge photos' })
    fireEvent.keyDown(photo, { key: 'ArrowRight' })
    fireEvent.keyDown(photo, { key: 'ArrowRight' })
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    expect(document.querySelector('.photo-departing')).toBeNull()
    fireEvent.click(photo)
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    fireEvent.click(screen.getByRole('button', { name: 'Close photo gallery' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(photo).toHaveFocus()
  })

  it('handles missing photos, a single photo and failed image loads honestly', () => {
    const view = render(<PhotoCarousel photos={[]} name="Tim"/>)
    expect(screen.getByRole('img', { name: 'Space for personal photos' })).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    view.rerender(<PhotoCarousel photos={photos.slice(0, 1)} name="Tim"/>)
    expect(screen.getByRole('button', { name: 'Enlarge photos' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Next photo' })).not.toBeInTheDocument()
    fireEvent.error(screen.getByRole('img', { name: 'Erstes Testfoto' }))
    expect(screen.getByText('Photo unavailable')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge photos' }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Close photo gallery' })).toHaveFocus()
  })

  it('cancels a pending flip timer when removed', () => {
    vi.useFakeTimers()
    const view = render(<PhotoCarousel photos={photos} name="Tim"/>)
    fireEvent.keyDown(screen.getByRole('button', { name: 'Enlarge photos' }), { key: 'ArrowRight' })
    expect(vi.getTimerCount()).toBe(1)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('drags in the large view, closes on Escape or backdrop, and leaves navigation buttons in the small view', () => {
    vi.useFakeTimers()
    render(<PhotoCarousel photos={photos} name="Tim"/>)
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(status()).toBe('Photo 2 of 3')
    finishFlip()
    const trigger = screen.getByRole('button', { name: 'Enlarge photos' })
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog')
    const photo = within(dialog).getByRole('button', { name: 'Browse photos' })
    vi.spyOn(photo, 'clientWidth', 'get').mockReturnValue(200)
    const portal = photo.closest<HTMLElement>('.photo-portal')!
    vi.spyOn(portal, 'clientWidth', 'get').mockReturnValue(216)
    vi.spyOn(portal, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 432, 491))
    fireEvent.pointerDown(photo, pointer(300))
    fireEvent.pointerMove(photo, pointer(120))
    expect(photo.style.getPropertyValue('--drag-x')).toBe('-90px')
    fireEvent.pointerUp(photo, pointer(120))
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    finishFlip()
    fireEvent.click(photo, { detail: 1 })
    expect(status()).toBe('Photo 3 of 3 · Placeholder')
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    finishFlip()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    fireEvent.click(trigger)
    const reopened = screen.getByRole('dialog')
    // A drag starting on the photo and ending outside must not dismiss the gallery.
    fireEvent.pointerDown(within(reopened).getByRole('button', { name: 'Browse photos' }), pointer(100))
    fireEvent.click(reopened)
    expect(reopened).toBeVisible()
    fireEvent.pointerDown(reopened)
    fireEvent.click(reopened)
    finishFlip()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('starts the same photos at their exact source position and can reverse before opening finishes', () => {
    vi.useFakeTimers()
    const originalAnimate = HTMLElement.prototype.animate
    const animations: { frames: Keyframe[]; cancel: () => void; onfinish: (() => void) | null }[] = []
    HTMLElement.prototype.animate = vi.fn((frames: Keyframe[] | PropertyIndexedKeyframes | null) => {
      const animation = { frames: frames as Keyframe[], cancel: vi.fn(), onfinish: null as (() => void) | null }
      animations.push(animation)
      return animation as unknown as Animation
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('photo-lightbox-anchor') ? new DOMRect(410, 190, 460, 523) : new DOMRect(110, 120, 200, 227)
    })
    try {
      render(<PhotoCarousel photos={photos} name="Tim"/>)
      const trigger = screen.getByRole('button', { name: 'Enlarge photos' })
      const image = within(trigger).getByRole('img')
      fireEvent.click(trigger)
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByRole('button', { name: 'Browse photos' })).toBe(trigger)
      expect(within(trigger).getByRole('img')).toBe(image)
      expect(animations[0].frames).toEqual([
        { transform: 'translate3d(-300px,-70px,0) scale(1)' },
        { transform: 'translate3d(0,0,0) scale(2.3)' },
      ])
      expect(trigger.closest<HTMLElement>('.photo-portal')!.style.transform).toBe('translate3d(-300px,-70px,0) scale(1)')
      fireEvent(dialog, new Event('cancel', { cancelable: true }))
      expect(animations[0].cancel).toHaveBeenCalled()
      act(() => animations[2].onfinish?.())
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Enlarge photos' })).toBe(trigger)
      expect(trigger).toHaveFocus()
      fireEvent.click(trigger)
      fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
      animations.at(-2)!.cancel()
      finishFlip()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    } finally {
      HTMLElement.prototype.animate = originalAnimate
    }
  })
})
