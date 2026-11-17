import { useState, type CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'

/** Original pixel drawing, not a portrait. Whole pixels and discrete poses keep the 8-bit feel. */
export function ChalkClimber({ cue = 0, compact = false }: { cue?: number; compact?: boolean }) {
  const [replay, setReplay] = useState(0)
  const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties

  return <button className={`chalk-climber ${compact ? 'is-compact' : ''}`} style={colors}
    aria-label={`${siteConfig.profile.name}: Chalk up`}
    onPointerEnter={(event) => { if (event.pointerType !== 'touch') setReplay(value => value + 1) }}
    onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setReplay(value => value + 1) }}
    onClick={() => setReplay(value => value + 1)}>
    <svg key={`${cue}-${replay}`} className={`pixel-climber ${cue + replay > 0 ? 'is-chalking' : ''}`} viewBox="0 0 40 52" fill="none" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M6 48h27v1h3v1H10v-1H6z" fill="#b3c0d5"/>
      <g className="pixel-body">
        <path d="M14 32h14v4h1v6h-2v3h-6v-7h-2v4h-2v3h-7v-3h2v-6h2z" fill="var(--pixel-trousers)"/>
        <path d="M14 35h3v4h-2v3h-2v-5h1zM23 35h4v2h-3v1h-1z" fill="#586a88"/>
        <path d="M10 42h7v2h-7zM21 42h7v2h-7z" fill="#8191a4"/>
        <path d="M11 44h6v2h-6zM22 44h5v2h-5z" fill="var(--pixel-skin)"/>
        <path d="M10 45h7v3h-2v1H5v-2h3v-1h2zM22 45h6v1h3v1h3v2H21v-3h1z" fill="#19253a"/>
        <path d="M9 46h5v1H9zM24 46h4v1h-4z" fill="#d8ac65"/>
        <path d="M5 48h11v1H5zM21 48h13v1H21z" fill="#596d8b"/>
        <g className="pixel-upper-body">
        <path d="M14 21h12v1h3v2h2v5h-4v6H13v-6H9v-5h3v-2h2z" fill="var(--pixel-shirt)"/>
        <path d="M13 22h4v1h-3v2h-2v2h-2v-3h3z" fill="#9bbafb"/>
        <path d="M24 24h3v4h-1v5h-4v-1h2zM14 32h5v1h-5z" fill="#294ab8"/>
        <path d="M10 27h4v2H9v-2zM27 27h4v2h-4z" fill="#bdcedd"/>
        <path d="M17 21h8v2h-2v1h-5v-1h-1z" fill="#203a86"/>
        <path d="M18 20h6v2h-2v1h-3v-1h-1z" fill="var(--pixel-skin)"/>
        <PixelTimHead/>
        <g className="pixel-cough-face">
          <path d="M17 14h3v2h-3zM24 14h3v2h-3zM21 18h3v2h-3z" fill="var(--pixel-skin)"/>
          <path d="M17 14h2v1h1v1h-3v-1h1zM24 14h2v1h1v1h-3v-1h1zM21 18h3v2h-3z" fill="#29263a"/>
        </g>
        <path d="M13 33h14v2H13zM25 32h4v2h-4z" fill="#243048"/>
        <path d="M18 33h3v2h-3z" fill="#98a5ac"/>
        <g className="pixel-chalkbag">
          <path d="M27 31h9v7h-1v3h-7v-1h-2v-7h1z" fill="#9c442f"/>
          <path d="M27 33h8v5h-2v2h-5v-1h-1z" fill="var(--pixel-chalkBag)"/>
          <path d="M27 31h9v3h-9z" fill="#28344f"/>
          <path d="M28 31h6v1h-6zM28 35h2v3h-2z" fill="#ffdea8"/>
          <path d="M34 35h2v1h1v2h-1v-1h-2z" fill="#364860"/>
        </g>
        <g className="pixel-pose-idle" fill="var(--pixel-skin)">
          <path d="M9 28h4v4h2v2h-4v-2H9zM28 28h3v3h-2v3h-4v-3h3z"/>
          <path d="M11 32h3v1h-3zM25 32h3v1h-3z" fill="#ffedce"/>
        </g>
        <g className="pixel-pose-dip">
          <path d="M9 28h4v3h3v-1h4v3h-3v1h-5v-2H9z" fill="var(--pixel-skin)"/>
          <path d="M28 28h3v1h3v2h-2v3h-3v-4h-1z" fill="#dca17f"/>
          <path d="M29 32h4v1h-4z" fill="#fff5dd"/>
        </g>
        <g className="pixel-pose-rub">
          <path d="M10 27h4v3h4v-3h3v5h-3v2h-5v-2h-3zM28 27h3v5h-3v2h-4v-3h-2v-4h3v3h3z" fill="var(--pixel-skin)"/>
          <g className="pixel-hand-left"><path d="M18 25h5v4h-5z" fill="var(--pixel-skin)"/><path d="M20 25h3v2h-3z" fill="#fff"/></g>
          <g className="pixel-hand-right"><path d="M22 24h4v4h-4z" fill="var(--pixel-skin)"/><path d="M22 24h3v2h-3z" fill="#fff"/></g>
        </g>
        <g className="pixel-pose-clap" fill="var(--pixel-skin)">
          <path d="M10 27h4v3h2v-2h2v-3h4v4h-3v3h-3v2h-4v-2h-2zM28 27h3v5h-3v2h-4v-3h-2v-6h3v4h3z"/>
          <path d="M18 25h4v2h-4zM22 25h3v2h-3z" fill="#fff"/>
        </g>
        <g className="pixel-pose-cough" fill="var(--pixel-skin)">
          <path d="M10 27h4v4h6v3h-7v-2h-3zM28 27h3v-4h-3v-3h-3v-2h-3v4h3v4h3z"/>
          <path d="M22 18h3v1h-3z" fill="#fff"/>
        </g>
        </g>
      </g>
      <g className="pixel-chalk-cloud" fill="#fffdf7" stroke="#a9bad4" strokeWidth=".5">
        <path className="chalk-puff puff-left" d="M13 24h3v-2h3v2h2v3h-3v2h-4v-2h-1zM9 26h2v2H9zM13 31h1v1h-1z"/>
        <path className="chalk-puff puff-right" d="M24 22h4v2h3v3h-2v2h-4v-2h-2v-3h1zM32 26h2v2h-2zM29 31h1v1h-1z"/>
        <path className="chalk-puff puff-up" d="M19 20h2v-2h3v2h2v4h-2v2h-4v-2h-2v-3h1zM16 23h2v2h-2zM26 19h2v2h-2z"/>
      </g>
      <g className="pixel-chalk-spark" fill="#fff"><path d="M9 18h2v2H9zM32 17h2v2h-2zM22 13h1v1h-1z"/></g>
      <g className="pixel-cough-puff" fill="#fff" stroke="#a9bad9" strokeWidth=".3"><path d="M30 19h2v2h-2zM33 17h2v2h-2zM34 22h1v1h-1z"/></g>
    </svg>
    <span className="climber-name" aria-hidden="true">{siteConfig.profile.name}</span>
  </button>
}
