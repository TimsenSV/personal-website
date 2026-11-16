import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export type PhotoOrigin = { left: number; top: number; width: number; height: number }

export function PhotoLightbox({ name, origin, trigger, onClose, children }: {
  name: string; origin: PhotoOrigin; trigger: HTMLButtonElement; onClose: () => void; children: ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const backdropPress = useRef(false)
  const [closing, setClosing] = useState(false)
  const reducedMotion = useReducedMotion()
  const titleId = useId()

  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    const stack = stackRef.current!
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    // Measure after showModal: a closed dialog has no layout box.
    stack.style.animation = 'none'
    const target = stack.getBoundingClientRect()
    stack.style.setProperty('--origin-x', `${origin.left + origin.width / 2 - target.left - target.width / 2}px`)
    stack.style.setProperty('--origin-y', `${origin.top + origin.height / 2 - target.top - target.height / 2}px`)
    stack.style.setProperty('--origin-scale', String(target.width ? origin.width / target.width : 1))
    stack.style.animation = ''
    const focusTarget = dialog.querySelector<HTMLButtonElement>('.photo-current:not(:disabled)') ?? dialog.querySelector<HTMLButtonElement>('[data-close]')
    focusTarget?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger.focus({ preventScroll: true })
    }
  }, [origin, trigger])

  useEffect(() => {
    if (!closing) return
    // Also finish if animation events are unavailable or interrupted.
    const timer = window.setTimeout(onClose, reducedMotion ? 0 : 320)
    return () => window.clearTimeout(timer)
  }, [closing, onClose, reducedMotion])

  function close() {
    if (closing) return
    if (reducedMotion) onClose()
    else setClosing(true)
  }

  return createPortal(<dialog ref={dialogRef} className={`photo-lightbox ${closing ? 'is-closing' : ''}`} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); close() }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return
      const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')]
        .filter(button => !button.closest('[inert]'))
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}
    onPointerDown={event => { backdropPress.current = event.target === event.currentTarget }}
    onClick={event => { if (backdropPress.current && event.target === event.currentTarget) close() }}>
    <h2 id={titleId} className="sr-only">Fotos von {name}</h2>
    <button className="photo-lightbox-close" data-close onClick={close} aria-label="Fotogalerie schließen"><X size={22}/></button>
    <div ref={stackRef} className="photo-lightbox-stack" inert={closing} onAnimationEnd={event => {
      if (event.target === event.currentTarget && event.animationName === 'polaroid-collapse') onClose()
    }}>{children}</div>
  </dialog>, document.body)
}
