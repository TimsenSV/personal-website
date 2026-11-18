import { animate } from 'motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useId, useRef, type PointerEvent } from 'react'
import { cvConfig } from '../content/cv'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { RegisterTim } from './RegisterTim'

type Grab = { id: number; x: number; y: number; start: number; axis: 'pending' | 'horizontal' | 'vertical' }
const releasePoint = .7

export function PullRegister({ onOpen }: { onOpen: (paper: DOMRect) => void }) {
  const anchor = useRef<HTMLSpanElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const paper = useRef<HTMLSpanElement>(null)
  const grab = useRef<Grab | null>(null)
  const offset = useRef(0)
  const travel = useRef(80)
  const motion = useRef<ReturnType<typeof animate<number>> | null>(null)
  const opening = useRef(false)
  const skipClick = useRef(false)
  const hint = useId()
  const reduced = useReducedMotion()

  function measure() {
    const slot = anchor.current
    if (!slot) return
    const start = slot.getBoundingClientRect()
    const desk = slot.closest('.intro-desk')!.getBoundingClientRect()
    const room = desk.right - start.right
    travel.current = Math.max(32, Math.min(104, room - 30))
    slot.style.setProperty('--tumble-exit', Math.max(48, room + 22) + 'px')
  }

  useEffect(() => {
    measure()
    const desk = anchor.current!.closest('.intro-desk')!
    const observer = window.ResizeObserver && new ResizeObserver(measure)
    observer?.observe(desk)
    return () => {
      observer?.disconnect()
      motion.current?.stop()
    }
  }, [])

  function takeHold(phase: 'pulling' | 'opening') {
    const el = button.current!
    if (el.dataset.phase !== 'pulling' && el.dataset.phase !== 'opening') {
      const tim = el.querySelector('.register-tim')!
      el.toggleAttribute('data-tim-riding', getComputedStyle(tim).getPropertyValue('--at-grip').trim() !== '0')
    }
    el.dataset.phase = phase
  }

  function position(px: number) {
    offset.current = px
    const el = button.current
    if (!el) return
    el.style.setProperty('--travel-x', px + 'px')
    el.style.setProperty('--paper-turn', (3 - 5 * px / travel.current) + 'deg')
    el.dataset.ready = String(px >= travel.current * releasePoint)
  }

  function settle(to: number, duration: number, done?: () => void) {
    motion.current?.stop()
    if (reduced || !button.current?.animate || Math.abs(to - offset.current) < .5) {
      position(to)
      done?.()
      return
    }
    motion.current = animate(offset.current, to, {
      duration, ease: [.2, .76, .27, 1], onUpdate: position, onComplete: done,
    })
  }

  function retract() {
    opening.current = false
    grab.current = null
    if (button.current) button.current.dataset.phase = 'returning'
    settle(0, .26, () => {
      if (!button.current) return
      button.current.dataset.phase = 'rest'
      button.current.removeAttribute('data-tim-riding')
    })
  }

  function reveal() {
    if (opening.current) return
    opening.current = true
    takeHold('opening')
    button.current!.focus({ preventScroll: true })
    settle(travel.current, .23, () => {
      const from = paper.current!.getBoundingClientRect()
      onOpen(from)
      retract()
    })
  }

  function start(e: PointerEvent<HTMLButtonElement>) {
    if (opening.current || grab.current || !e.isPrimary || e.button !== 0) return
    measure()
    motion.current?.stop()
    skipClick.current = false
    grab.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: offset.current, axis: 'pending' }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function follow(e: PointerEvent<HTMLButtonElement>) {
    const gesture = grab.current
    if (!gesture || gesture.id !== e.pointerId) return
    const dx = e.clientX - gesture.x
    const dy = e.clientY - gesture.y
    if (gesture.axis === 'pending' && Math.max(Math.abs(dx), Math.abs(dy)) > 6) {
      gesture.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      skipClick.current = true
    }
    if (gesture.axis !== 'horizontal') return
    if (e.currentTarget.dataset.phase !== 'pulling') takeHold('pulling')
    position(Math.max(0, Math.min(travel.current, gesture.start + dx)))
  }

  function release(e: PointerEvent<HTMLButtonElement>) {
    if (grab.current?.id !== e.pointerId) return
    follow(e)
    const { axis } = grab.current
    grab.current = null
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (axis === 'horizontal' && offset.current >= travel.current * releasePoint) reveal()
    else if (axis !== 'pending') retract()
  }

  function cancel() {
    if (!grab.current && !opening.current) return
    skipClick.current = true
    retract()
  }

  return <span className="cv-index-anchor" ref={anchor}>
    <span className="sr-only" id={hint}>Pull right and release, or activate to open the CV.</span>
    <button type="button" ref={button} className="cv-index" aria-label="Open CV" aria-haspopup="dialog" aria-describedby={hint}
      onPointerDown={start} onPointerMove={follow} onPointerUp={release} onBlur={cancel}
      onPointerCancel={cancel} onLostPointerCapture={e => { if (grab.current?.id === e.pointerId) cancel() }}
      onKeyDown={e => { if (e.key === 'Escape') cancel() }}
      onClick={e => {
        if (e.detail > 0 && skipClick.current) return
        measure()
        reveal()
      }}>
      <span className="register-piece" aria-hidden="true">
        <span className="register-paper" ref={paper}>
          <span className="register-letterhead">{cvConfig.name}</span>
          <span className="register-experience">Experience</span>
          {cvConfig.experience.slice(0, 2).map(role => <span className="register-entry" key={role.organization}>{role.organization}</span>)}
        </span>
        <span className="register-tab"><span>CV</span><ArrowRight size={14}/></span>
        <RegisterTim/>
      </span>
    </button>
  </span>
}
