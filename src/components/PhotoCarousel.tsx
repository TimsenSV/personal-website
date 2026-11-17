import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react'
import type { ProfilePhoto } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { assetUrl } from '../lib/links'
import { PhotoLightbox } from './PhotoLightbox'

type Gesture = { pointer: number; x: number; y: number; width: number; scale: number; axis: 'pending' | 'horizontal' | 'vertical'; offset: number }
type Departure = { photo: ProfilePhoto; index: number; direction: number; offset: number }

function PhotoImage({ photo, expanded, active }: { photo: ProfilePhoto; expanded: boolean; active: boolean }) {
  const [failed, setFailed] = useState(false)
  const srcSet = photo.preview && photo.width ? `${assetUrl(photo.preview.src)} ${photo.preview.width}w, ${assetUrl(photo.src)} ${photo.width}w` : undefined
  return <span className="polaroid-media">
    {failed ? <span className="polaroid-missing"><Camera size={30}/><span>Photo unavailable</span></span> : <img src={assetUrl(photo.src)} srcSet={srcSet} sizes={expanded ? '(max-width: 520px) calc(100vw - 88px), 440px' : '230px'} alt={photo.alt} width={photo.width ?? 640} height={photo.height ?? 640} draggable={false} decoding="async" loading={active ? 'eager' : 'lazy'} fetchPriority={active ? 'high' : 'low'} onError={() => setFailed(true)} style={{ objectPosition: photo.position, transform: `scale(${photo.zoom ?? 1})`, filter: photo.monochrome ? 'grayscale(1)' : undefined }}/>}
  </span>
}

function PhotoPrint({ photo, index, total, expanded = false, active = false }: { photo: ProfilePhoto; index: number; total: number; expanded?: boolean; active?: boolean }) {
  return <><PhotoImage key={photo.src} photo={photo} expanded={expanded} active={active}/><span className="polaroid-caption"><span>{photo.placeholder ? 'Placeholder' : photo.caption}</span><span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></span></>
}

function PhotoDeck({ photos, name, index, onChange, onOpen, expanded = false }: {
  photos: ProfilePhoto[]; name: string; index: number; onChange: (index: number) => void
  onOpen?: (trigger: HTMLButtonElement) => void; expanded?: boolean
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
    const portal = event.currentTarget.closest<HTMLElement>('.photo-portal')
    const scale = portal?.clientWidth ? portal.getBoundingClientRect().width / portal.clientWidth : 1
    gesture.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, width: event.currentTarget.clientWidth, scale, axis: 'pending', offset: 0 }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current
    if (!drag || drag.pointer !== event.pointerId) return
    const dx = (event.clientX - drag.x) / drag.scale
    const dy = (event.clientY - drag.y) / drag.scale
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

  if (!photos.length) return <div className="photo-carousel photo-empty" role="img" aria-label="Space for personal photos"><Camera size={32}/><span>Photos coming soon.</span></div>

  return <div className={`photo-carousel ${expanded ? 'photo-carousel-large' : ''} ${dragging ? 'is-dragging' : ''} ${departure ? 'is-flipping' : ''}`} role="region" aria-roledescription="carousel" aria-label={`Photos of ${name}`} onKeyDown={event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    flip(event.key === 'ArrowRight' ? 1 : -1)
  }}>
    <span id={hintId} className="sr-only">{onOpen ? 'Click to enlarge. Drag or use the arrow keys to browse photos.' : 'Click, drag or use the arrow keys to browse photos.'}</span>
    <div className="photo-deck">
      {Array.from({ length: Math.min(photos.length - 1, 2) }, (_, depth) => {
        const back = (current + depth + 1) % photos.length
        return <div key={depth} className={`polaroid-frame photo-back photo-back-${depth + 1}`} aria-hidden="true"><PhotoPrint photo={photos[back]} index={back} total={photos.length}/></div>
      })}
      <button className="polaroid-frame photo-current" aria-label={onOpen ? 'Enlarge photos' : 'Browse photos'} aria-haspopup={onOpen ? 'dialog' : undefined} aria-describedby={hintId} disabled={!canFlip && !onOpen}
        style={{ '--drag-x': `${reducedMotion ? 0 : offset}px`, '--drag-tilt': `${reducedMotion ? 0 : offset / 18}deg` } as CSSProperties}
        onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel}
        onClick={event => {
          if (event.detail > 0 && suppressClick.current) { suppressClick.current = false; return }
          if (busy.current) return
          if (onOpen) onOpen(event.currentTarget)
          else flip(1)
        }}>
        <PhotoPrint photo={photos[current]} index={current} total={photos.length} expanded={expanded} active/>
      </button>
      {departure && <div className="polaroid-frame photo-departing" aria-hidden="true" style={{ '--flip-direction': -departure.direction, '--flip-start': `${departure.offset}px` } as CSSProperties}><PhotoPrint photo={departure.photo} index={departure.index} total={photos.length} expanded={expanded}/></div>}
    </div>
    {canFlip && <><button className="photo-nav photo-prev" aria-label="Previous photo" onClick={() => flip(-1)}><ArrowLeft size={15}/></button><button className="photo-nav photo-next" aria-label="Next photo" onClick={() => flip(1)}><ArrowRight size={15}/></button></>}
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Photo {current + 1} of {photos.length}{photos[current].placeholder ? ' · Placeholder' : ''}</span>
  </div>
}

export function PhotoCarousel({ photos, name }: { photos: ProfilePhoto[]; name: string }) {
  const [index, setIndex] = useState(0)
  return <PhotoLightbox name={name}>{({ expanded, open }) =>
    <PhotoDeck photos={photos} name={name} index={index} onChange={setIndex} expanded={expanded} onOpen={expanded ? undefined : open}/>
  }</PhotoLightbox>
}
