import { useEffect, useRef } from 'react'

const maxTilt = 4

/** Pointer-only enhancement. No React renders per move, no transform on open pop-outs. */
export function useCanvasTilt() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const media = window.matchMedia?.('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!canvas || !media) return
    let active: HTMLElement | null = null
    let bounds: DOMRect | null = null
    let frame = 0
    function reset(immediate = false) {
      cancelAnimationFrame(frame)
      if (active) {
        if (immediate) active.dataset.tiltReset = ''
        active.removeAttribute('data-tilt-active')
        active.style.removeProperty('--tilt-x')
        active.style.removeProperty('--tilt-y')
      }
      active = null; bounds = null
    }
    function move(event: PointerEvent) {
      const card = event.target instanceof Element ? event.target.closest<HTMLElement>('.card') : null
      const parent = card?.parentElement
      const inCanvas = parent === canvas || (parent?.hasAttribute('data-tilt-group') && parent.parentElement === canvas)
      if (!media!.matches || event.pointerType !== 'mouse' || event.buttons || !card || !inCanvas || document.querySelector('dialog[open]') || card.querySelector('[role="dialog"]')) { reset(true); return }
      if (card !== active) {
        reset()
        active = card
        card.removeAttribute('data-tilt-reset')
        bounds = card.getBoundingClientRect()
      }
      if (!bounds?.width || !bounds.height) return
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${-y * maxTilt}deg`)
        card.style.setProperty('--tilt-y', `${x * maxTilt}deg`)
        card.dataset.tiltActive = ''
      })
    }
    const leave = () => reset()
    const settle = () => reset(true)
    canvas.addEventListener('pointermove', move, { passive: true })
    canvas.addEventListener('pointerleave', leave)
    // Clear the containing block synchronously before a pop-out measures itself.
    canvas.addEventListener('pointerdown', settle, true)
    canvas.addEventListener('keydown', settle, true)
    window.addEventListener('blur', settle)
    window.addEventListener('resize', settle)
    window.addEventListener('scroll', settle, true)
    media.addEventListener('change', settle)
    return () => {
      reset(true)
      canvas.querySelectorAll('[data-tilt-reset]').forEach(card => card.removeAttribute('data-tilt-reset'))
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('pointerdown', settle, true)
      canvas.removeEventListener('keydown', settle, true)
      window.removeEventListener('blur', settle)
      window.removeEventListener('resize', settle)
      window.removeEventListener('scroll', settle, true)
      media.removeEventListener('change', settle)
    }
  }, [])
  return ref
}
