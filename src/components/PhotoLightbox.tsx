import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Origin = { rect: DOMRect; trigger: HTMLButtonElement }
const duration = 680
const easing = 'cubic-bezier(.32,.05,.2,1)'

export function PhotoLightbox({ name, children }: {
  name: string; children: (controls: { expanded: boolean; open: (trigger: HTMLButtonElement) => void }) => ReactNode
}) {
  // One persistent portal: the actual, already decoded photos move between the
  // card and the dialog. Keeping their layout size also preserves every crop.
  const [host] = useState(() => Object.assign(document.createElement('div'), { className: 'photo-portal' }))
  const slotRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const travel = useRef<Animation | null>(null)
  const turn = useRef<Animation | null>(null)
  const closingRef = useRef(false)
  const closeTimer = useRef<number | null>(null)
  const backdropPress = useRef(false)
  const [origin, setOrigin] = useState<Origin | null>(null)
  const [closing, setClosing] = useState(false)
  const reducedMotion = useReducedMotion()
  const titleId = useId()

  useLayoutEffect(() => {
    slotRef.current!.append(host)
    return () => host.remove()
  }, [host])

  useLayoutEffect(() => {
    if (!origin) return
    const dialog = dialogRef.current!
    const anchor = anchorRef.current!
    const slot = slotRef.current!
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()

    const target = anchor.getBoundingClientRect()
    const width = origin.rect.width || target.width || 216
    const scale = target.width / width || 1
    const from = `translate3d(${origin.rect.left - target.left}px,${origin.rect.top - target.top}px,0) scale(1)`
    const to = `translate3d(0,0,0) scale(${scale})`
    host.setAttribute('style', `position:absolute;left:0;top:0;width:${width}px;transform-origin:0 0;--gallery-scale:${scale};`)
    anchor.append(host)
    // Install the first frame synchronously, before the browser can paint the
    // modal. Travel and tilt are separate so rotation never bends the path.
    const deck = host.querySelector<HTMLElement>('.photo-deck')
    if (!reducedMotion && host.animate) {
      host.style.setProperty('transform', from)
      const movement = host.animate([{ transform: from }, { transform: to }], { duration, easing, fill: 'both' })
      movement.onfinish = () => { host.style.setProperty('transform', to); movement.cancel() }
      travel.current = movement
      turn.current = deck?.animate([
        { transform: 'perspective(1000px) rotateY(0deg) rotateZ(0deg)' },
        { transform: 'perspective(1000px) rotateY(-22deg) rotateZ(-8deg)', offset: .42 },
        { transform: 'perspective(1000px) rotateY(0deg) rotateZ(0deg)' },
      ], { duration, easing: 'ease-in-out' }) ?? null
    } else host.style.setProperty('transform', to)
    const focusTarget = dialog.querySelector<HTMLButtonElement>('.photo-current:not(:disabled)') ?? dialog.querySelector<HTMLButtonElement>('[data-close]')
    focusTarget?.focus({ preventScroll: true })

    let currentScale = scale
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
      if (closingRef.current) return
      const next = anchor.getBoundingClientRect().width / width || 1
      if (Math.abs(next - currentScale) < .001) return
      currentScale = next
      travel.current?.cancel()
      turn.current?.cancel()
      host.style.setProperty('transform', `translate3d(0,0,0) scale(${next})`)
      host.style.setProperty('--gallery-scale', String(next))
    })
    observer?.observe(anchor)
    return () => {
      observer?.disconnect()
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
      closingRef.current = false
      if (travel.current) { travel.current.onfinish = null; travel.current.cancel() }
      turn.current?.cancel()
      dialog.close()
      host.removeAttribute('style')
      slot.append(host)
      document.body.style.overflow = previousOverflow
      origin.trigger.focus({ preventScroll: true })
    }
  }, [host, origin, reducedMotion])

  function close() {
    if (!origin || closingRef.current) return
    const finish = () => { setOrigin(null); setClosing(false) }
    if (reducedMotion || !host.animate) { finish(); return }
    closingRef.current = true
    setClosing(true)
    const anchor = anchorRef.current!.getBoundingClientRect()
    const destination = slotRef.current!.getBoundingClientRect()
    const width = Number.parseFloat(host.style.width)
    const from = getComputedStyle(host).transform
    const deck = host.querySelector<HTMLElement>('.photo-deck')
    const tilt = deck ? getComputedStyle(deck).transform : 'none'
    // A quick Escape during opening reverses from the currently visible frame.
    travel.current?.cancel()
    turn.current?.cancel()
    const to = `translate3d(${destination.left - anchor.left}px,${destination.top - anchor.top}px,0) scale(${destination.width / width})`
    host.style.setProperty('transform', from)
    travel.current = host.animate([{ transform: from }, { transform: to }], { duration: 360, easing, fill: 'both' })
    if (deck) turn.current = deck.animate([{ transform: tilt }, { transform: 'none' }], { duration: 360, easing })
    travel.current.onfinish = finish
    closeTimer.current = window.setTimeout(finish, 400)
  }

  return <>
    <div ref={slotRef} className="photo-slot"/>
    {createPortal(<dialog ref={dialogRef} className={`photo-lightbox ${closing ? 'is-closing' : ''}`} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); close() }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')].filter(button => !button.closest('[inert]'))
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }}
      onPointerDown={event => { backdropPress.current = event.target === event.currentTarget }}
      onClick={event => { if (backdropPress.current && event.target === event.currentTarget) close() }}>
      <h2 id={titleId} className="sr-only">Photos of {name}</h2>
      <button className="photo-lightbox-close" data-close onClick={close} aria-label="Close photo gallery"><X size={22}/></button>
      <div ref={anchorRef} className="photo-lightbox-anchor" inert={closing}/>
      {createPortal(children({ expanded: !!origin, open: trigger => setOrigin({ rect: host.getBoundingClientRect(), trigger }) }), host)}
    </dialog>, document.body)}
  </>
}
