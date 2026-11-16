import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react'
import type { ProfilePhoto } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { assetUrl } from '../lib/links'
import { PhotoLightbox, type PhotoOrigin } from './PhotoLightbox'

type Gesture = { pointer: number; x: number; y: number; width: number; axis: 'pending' | 'horizontal' | 'vertical'; offset: number }
type Departure = { photo: ProfilePhoto; index: number; direction: number; offset: number }

function PhotoImage({ photo }: { photo: ProfilePhoto }) {
  const [failed, setFailed] = useState(false)
  return <span className="polaroid-media">
    {failed ? <span className="polaroid-missing"><Camera size={30}/><span>Foto nicht verfügbar</span></span> : <img src={assetUrl(photo.src)} alt={photo.alt} width="640" height="640" draggable={false} decoding="async" onError={() => setFailed(true)} style={{ objectPosition: photo.position, transform: `scale(${photo.zoom ?? 1})`, filter: photo.monochrome ? 'grayscale(1)' : undefined }}/>} 
  </span>
}

function PhotoPrint({ photo, index, total }: { photo: ProfilePhoto; index: number; total: number }) {
  return <><PhotoImage key={photo.src} photo={photo}/><span className="polaroid-caption"><span>{photo.placeholder ? 'Platzhalter' : photo.caption ?? 'Ein bisschen ich.'}</span><span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></span></>
}

function PhotoDeck({ photos, name, index, onChange, onOpen, expanded = false, concealed = false }: {
  photos: ProfilePhoto[]; name: string; index: number; onChange: (index: number) => void
  onOpen?: (trigger: HTMLButtonElement) => void; expanded?: boolean; concealed?: boolean
}) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [departure, setDeparture] = useState<Departure | null>(null)
  const gesture = useRef<Gesture | null>(null)
  const suppressClick = useRef(false)
  const busy = useRef(false)
  const reducedMotion = useReducedMotion()
  const hintId = useId()
  const current = photos.length ? index % photos.length : 0
  const canFlip = photos.length > 1

  useEffect(() => {
    if (!departure) return
    const timer = window.setTimeout(() => { setDeparture(null); busy.current = false }, 380)
    return () => window.clearTimeout(timer)
  }, [departure])

  function flip(direction: number, dragOffset = 0) {
    if (!canFlip || busy.current) return
    if (!reducedMotion) {
      busy.current = true
      setDeparture({ photo: photos[current], index: current, direction, offset: dragOffset })
    }
    onChange((current + direction + photos.length) % photos.length)
    setOffset(0)
    setDragging(false)
  }

  function begin(event: PointerEvent<HTMLButtonElement>) {
    if (!canFlip || busy.current || event.button !== 0 || !event.isPrimary) return
    suppressClick.current = false
    gesture.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, width: event.currentTarget.clientWidth, axis: 'pending', offset: 0 }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current
    if (!drag || drag.pointer !== event.pointerId) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (drag.axis === 'pending' && Math.max(Math.abs(dx), Math.abs(dy)) > 8) drag.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
    if (drag.axis === 'pending') return
    suppressClick.current = true
    if (drag.axis === 'vertical') return
    drag.offset = Math.max(-drag.width, Math.min(drag.width, dx))
    setDragging(true)
    setOffset(drag.offset)
  }

  function finish(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current
    if (!drag || drag.pointer !== event.pointerId) return
    gesture.current = null
    if (drag.axis === 'horizontal' && Math.abs(drag.offset) >= Math.max(35, drag.width * .22)) flip(drag.offset < 0 ? 1 : -1, drag.offset)
    else { setOffset(0); setDragging(false) }
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function cancel() {
    if (!gesture.current) return
    gesture.current = null
    suppressClick.current = true
    setOffset(0)
    setDragging(false)
  }

  if (!photos.length) return <div className="photo-carousel photo-empty" role="img" aria-label="Platz für persönliche Fotos"><Camera size={32}/><span>Fotos folgen.</span></div>

  return <div className={`photo-carousel ${expanded ? 'photo-carousel-large' : ''} ${concealed ? 'is-open' : ''} ${dragging ? 'is-dragging' : ''} ${departure ? 'is-flipping' : ''}`} role="region" aria-roledescription="Karussell" aria-label={`Fotos von ${name}`} onKeyDown={event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    flip(event.key === 'ArrowRight' ? 1 : -1)
  }}>
    <span id={hintId} className="sr-only">{onOpen ? 'Mit Klick vergrößern. Mit Ziehen oder den Pfeiltasten durch die Fotos blättern.' : 'Mit Klick, Ziehen oder den Pfeiltasten durch die Fotos blättern.'}</span>
    <div className="photo-deck">
      {Array.from({ length: Math.min(photos.length - 1, 2) }, (_, depth) => {
        const back = (current + depth + 1) % photos.length
        return <div key={depth} className={`polaroid-frame photo-back photo-back-${depth + 1}`} aria-hidden="true"><PhotoPrint photo={photos[back]} index={back} total={photos.length}/></div>
      })}
      <button className="polaroid-frame photo-current" aria-label={onOpen ? 'Fotos vergrößern' : 'Fotos durchblättern'} aria-haspopup={onOpen ? 'dialog' : undefined} aria-describedby={hintId} disabled={!canFlip && !onOpen}
        style={{ '--drag-x': `${reducedMotion ? 0 : offset}px`, '--drag-tilt': `${reducedMotion ? 0 : offset / 18}deg` } as CSSProperties}
        onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel}
        onClick={event => {
          if (event.detail > 0 && suppressClick.current) { suppressClick.current = false; return }
          if (busy.current) return
          if (onOpen) onOpen(event.currentTarget)
          else flip(1)
        }}>
        <PhotoPrint photo={photos[current]} index={current} total={photos.length}/>
      </button>
      {departure && <div className="polaroid-frame photo-departing" aria-hidden="true" style={{ '--flip-direction': -departure.direction, '--flip-start': `${departure.offset}px` } as CSSProperties}><PhotoPrint photo={departure.photo} index={departure.index} total={photos.length}/></div>}
    </div>
    {canFlip && <><button className="photo-nav photo-prev" aria-label="Vorheriges Foto" onClick={() => flip(-1)}><ArrowLeft size={15}/></button><button className="photo-nav photo-next" aria-label="Nächstes Foto" onClick={() => flip(1)}><ArrowRight size={15}/></button></>}
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Foto {current + 1} von {photos.length}{photos[current].placeholder ? ' · Platzhalter' : ''}</span>
  </div>
}

export function PhotoCarousel({ photos, name }: { photos: ProfilePhoto[]; name: string }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState<{ origin: PhotoOrigin; trigger: HTMLButtonElement } | null>(null)

  return <>
    <PhotoDeck photos={photos} name={name} index={index} onChange={setIndex} concealed={!!open} onOpen={trigger => {
      const rect = trigger.closest('.photo-carousel')!.getBoundingClientRect()
      setOpen({ trigger, origin: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } })
    }}/>
    {open && <PhotoLightbox name={name} origin={open.origin} trigger={open.trigger} onClose={() => setOpen(null)}>
      <PhotoDeck photos={photos} name={name} index={index} onChange={setIndex} expanded/>
    </PhotoLightbox>}
  </>
}
