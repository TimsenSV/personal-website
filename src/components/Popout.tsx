import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, X } from 'lucide-react'

type PopoutProps = {
  label: string
  title: string
  trigger: ReactNode
  children: ReactNode
  action?: { label: string; onClick: () => void }
  className?: string
  buttonClassName?: string
}

/** A small, nonmodal preview. Tab can leave it; Escape returns to its trigger. */
export function Popout({ label, title, trigger, children, action, className = '', buttonClassName = '' }: PopoutProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function close() {
    triggerRef.current?.focus({ preventScroll: true })
    setOpen(false)
  }

  useLayoutEffect(() => {
    if (!open) return
    const trigger = triggerRef.current!
    const panel = panelRef.current!
    const position = () => {
      const rect = trigger.getBoundingClientRect()
      const margin = 16
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth
      const width = Math.min(324, viewportWidth - margin * 2)
      const availableHeight = Math.max(160, window.innerHeight - margin * 2)
      panel.style.width = `${width}px`
      panel.style.maxHeight = `${availableHeight}px`
      const height = panel.getBoundingClientRect().height
      const left = Math.max(margin, Math.min(rect.left + rect.width / 2 - width / 2, viewportWidth - width - margin))
      const above = rect.top - height - 12
      const top = above >= margin ? above : Math.min(rect.bottom + 12, window.innerHeight - height - margin)
      panel.style.left = `${left}px`
      panel.style.top = `${Math.max(margin, top)}px`
      panel.dataset.side = above >= margin ? 'above' : 'below'
    }
    const dismissOutside = (event: Event) => {
      if (!(event.target instanceof Node) || panel.contains(event.target) || trigger.contains(event.target)) return
      // Outside clicks and Tab keep their natural focus destination.
      setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      trigger.focus({ preventScroll: true })
      setOpen(false)
    }
    position()
    panel.querySelector<HTMLButtonElement>('[data-popout-close]')?.focus({ preventScroll: true })
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('focusin', dismissOutside)
    document.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('focusin', dismissOutside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return <div className={`popout-anchor ${className} ${open ? 'is-open' : ''}`}>
    <button ref={triggerRef} className={buttonClassName} aria-label={label} aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="dialog" onClick={() => setOpen(!open)}>{trigger}</button>
    {open && <div className="widget-popout" id={id} ref={panelRef} role="dialog" aria-labelledby={`${id}-title`}>
      <div className="popout-heading"><span id={`${id}-title`}>{title}</span><button data-popout-close className="icon-button" aria-label="Vorschau schließen" onClick={close}><X size={16}/></button></div>
      <div className="popout-content">{children}{action && <button className="button primary" onClick={() => { close(); action.onClick() }}>{action.label}<ArrowUpRight size={15}/></button>}</div>
    </div>}
  </div>
}
