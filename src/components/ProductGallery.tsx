import { useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, ImageOff, Maximize2 } from 'lucide-react'
import type { ProductScreenshot } from '../content/site'
import { assetUrl } from '../lib/links'
import { Window } from './Window'

function Screenshot({ item, lazy = false }: { item: ProductScreenshot; lazy?: boolean }) {
  const [failed, setFailed] = useState(false)
  return failed ? <span className="screenshot-unavailable" role="img" aria-label={`${item.alt}: screenshot unavailable`}><ImageOff size={28}/><span>Screenshot unavailable</span></span> : <img src={assetUrl(item.src)} alt={item.alt} width={item.width ?? 1600} height={item.height ?? 1000} loading={lazy ? 'lazy' : 'eager'} decoding="async" draggable={false} onError={() => setFailed(true)}/>
}

export function ProductGallery({ name, screenshots }: { name: string; screenshots: ProductScreenshot[] }) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  if (!screenshots.length) return null
  const current = index % screenshots.length
  const item = screenshots[current]
  const move = (direction: number) => setIndex((current + direction + screenshots.length) % screenshots.length)
  function keys(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); event.stopPropagation()
      move(event.key === 'ArrowRight' ? 1 : -1)
    }
  }
  const controls = <div className="screenshot-controls">
    <p role="status" aria-live="polite"><span>{current + 1} / {screenshots.length}</span>{item.caption ?? item.alt}</p>
    {screenshots.length > 1 && <div><button className="icon-button" aria-label="Previous screenshot" onClick={() => move(-1)}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Next screenshot" onClick={() => move(1)}><ArrowRight size={18}/></button></div>}
  </div>
  return <section className="product-gallery" aria-label={`${name} screenshots`} onKeyDown={keys}>
    <button className="screenshot-main" aria-label={`Enlarge screenshot: ${item.alt}`} aria-haspopup="dialog" onClick={() => setExpanded(true)}><Screenshot key={item.src} item={item} lazy/><span className="screenshot-enlarge" aria-hidden="true"><Maximize2 size={18}/></span></button>
    {!expanded && controls}
    {screenshots.length > 1 && <div className="screenshot-thumbnails" aria-label="Choose a screenshot">{screenshots.map((shot, i) => <button key={`${shot.src}-${i}`} aria-label={`Show screenshot ${i + 1}: ${shot.caption ?? shot.alt}`} aria-pressed={i === current} onClick={() => setIndex(i)}><Screenshot key={shot.src} item={shot} lazy/></button>)}</div>}
    {expanded && createPortal(<Window title={`${name} / Screenshots`} expandable={false} variant="screenshot-window" onClose={() => setExpanded(false)}><div className="screenshot-viewer" onKeyDown={keys}><div className="screenshot-full"><Screenshot key={item.src} item={item}/></div>{controls}</div></Window>, document.body)}
  </section>
}
