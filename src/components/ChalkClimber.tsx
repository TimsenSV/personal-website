import { useState, type CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'

/** Original pixel drawing, not a portrait. Whole pixels and discrete poses keep the 8-bit feel. */
export function ChalkClimber({ cue = 0, compact = false }: { cue?: number; compact?: boolean }) {
  const [replay, setReplay] = useState(0)
  const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties

  return <button className={`chalk-climber ${compact ? 'is-compact' : ''}`} style={colors}
    aria-label={`${siteConfig.profile.name}: Hände chalken`}
    onPointerEnter={(event) => { if (event.pointerType !== 'touch') setReplay(value => value + 1) }}
    onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setReplay(value => value + 1) }}
    onClick={() => setReplay(value => value + 1)}>
    <svg key={`${cue}-${replay}`} className={`pixel-climber ${cue + replay > 0 ? 'is-chalking' : ''}`} viewBox="0 0 40 52" fill="none" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M10 48h22v2H10zM13 50h16v1H13z" fill="#c3cde6"/>
      <g className="pixel-body">
        <path d="M14 33h14v6h-2v7h-5v-9h-2v9h-5z" fill="var(--pixel-trousers)"/>
        <path d="M14 35h3v8h-3zM24 35h2v8h-2z" fill="#6e7894"/>
        <path d="M12 44h7v4h-9v-2h2zM22 44h6v2h3v2h-9z" fill="#171c2c"/>
        <path d="M10 47h9v1h-9zM22 47h9v1h-9z" fill="#8294bf"/>
        <g className="pixel-upper-body">
        <path d="M14 21h13v2h4v6h-4v7H14v-7h-4v-6h4z" fill="var(--pixel-shirt)"/>
        <path d="M15 23h2v10h-2zM11 24h3v2h-3z" fill="#a1b9ff"/>
        <path d="M24 25h2v10h-2z" fill="#142d86" opacity=".45"/>
        <path d="M18 20h6v3h-6z" fill="var(--pixel-skin)"/>
        <PixelTimHead/>
        <g className="pixel-cough-face">
          <path d="M17 14h3v2h-3zM24 14h3v2h-3zM21 18h3v2h-3z" fill="var(--pixel-skin)"/>
          <path d="M17 14h2v1h1v1h-3v-1h1zM24 14h2v1h1v1h-3v-1h1zM21 18h3v2h-3z" fill="#29263a"/>
        </g>
        <path d="M14 34h13v1H14z" fill="#20273a"/>
        <path d="M27 31h6v7h-1v1h-4v-1h-1z" fill="var(--pixel-chalkBag)"/>
        <path d="M27 31h6v2h-6z" fill="#fff"/>
        <path d="M29 34h2v3h-2z" fill="#ffe0c8"/>
        <g className="pixel-pose-idle" fill="var(--pixel-skin)">
          <path d="M10 27h4v4h4v3h-5v-2h-3zM28 27h3v3h-2v4h-4v-3h3z"/>
        </g>
        <g className="pixel-pose-rub">
          <path d="M10 27h4v3h4v-3h3v5h-3v2h-5v-2h-3zM28 27h3v5h-3v2h-4v-3h-2v-4h3v3h3z" fill="var(--pixel-skin)"/>
          <g className="pixel-hand-left"><path d="M18 25h5v4h-5z" fill="var(--pixel-skin)"/><path d="M20 25h3v2h-3z" fill="#fff"/></g>
          <g className="pixel-hand-right"><path d="M22 24h4v4h-4z" fill="var(--pixel-skin)"/><path d="M22 24h3v2h-3z" fill="#fff"/></g>
        </g>
        <g className="pixel-pose-clap" fill="var(--pixel-skin)">
          <path d="M10 27h4v3h2v-4h4v3h-2v4h-5v-1h-3zM28 27h3v5h-3v1h-4v-4h-1v-3h4v4h1z"/>
          <path d="M16 25h4v2h-4zM23 25h4v2h-4z" fill="#fff"/>
        </g>
        <g className="pixel-pose-cough" fill="var(--pixel-skin)">
          <path d="M10 27h4v4h6v3h-7v-2h-3zM28 27h3v-4h-3v-3h-3v-2h-3v4h3v4h3z"/>
          <path d="M22 18h3v1h-3z" fill="#fff"/>
        </g>
        </g>
      </g>
      <g className="pixel-chalk-cloud" fill="#fff" stroke="#c6d3ed" strokeWidth=".3">
        <path className="chalk-puff puff-left" d="M16 22h3v3h-3zM13 27h2v2h-2zM17 29h1v1h-1z"/>
        <path className="chalk-puff puff-right" d="M26 22h3v3h-3zM29 27h2v2h-2zM27 30h1v1h-1z"/>
        <path className="chalk-puff puff-up" d="M21 19h3v3h-3zM19 25h2v2h-2zM24 26h2v2h-2z"/>
      </g>
      <g className="pixel-chalk-spark" fill="#fff"><path d="M9 18h2v2H9zM32 17h2v2h-2zM22 13h1v1h-1z"/></g>
      <g className="pixel-cough-puff" fill="#fff" stroke="#a9bad9" strokeWidth=".3"><path d="M30 19h2v2h-2zM33 17h2v2h-2zM34 22h1v1h-1z"/></g>
    </svg>
    <span className="climber-name" aria-hidden="true">{siteConfig.profile.name}</span>
  </button>
}
