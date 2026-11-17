import { useEffect, useId, useRef, useState } from 'react'
import { Maximize2, Minimize2, X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Window({ title, children, onClose, variant = '', expandable = true, initialFocus }: { title: string; children: ReactNode; onClose: () => void; variant?: string; expandable?: boolean; initialFocus?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    const focusTarget = (initialFocus ? dialog.querySelector<HTMLElement>(initialFocus) : null) ?? dialog.querySelector<HTMLButtonElement>('[data-close]')
    focusTarget?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [initialFocus])
  return <dialog ref={dialogRef} className={`window ${variant} ${expanded && expandable ? 'is-expanded' : ''}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose() }}
    onKeyDown={(event) => {
      if (event.target instanceof Element && event.target.closest('dialog') !== event.currentTarget) return
      if (event.key !== 'Tab') return
      const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, iframe, [tabindex]')]
        .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }}
    onClick={(event) => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
    }}>
    <div className="window-bar">
      <span className="window-chrome" aria-hidden="true"><i/><i/><i/></span>
      <h2 id={titleId}>{title}</h2>
      <div className="window-controls">
        {expandable && <button className="window-expand icon-button" onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Restore window' : 'Expand window'} aria-pressed={expanded}>{expanded ? <Minimize2 size={17}/> : <Maximize2 size={17}/>}</button>}
        <button className="icon-button" data-close onClick={onClose} aria-label="Close window"><X size={20}/><span className="mobile-close-label">Close</span></button>
      </div>
    </div>
    <div className="window-body">{children}</div>
  </dialog>
}
