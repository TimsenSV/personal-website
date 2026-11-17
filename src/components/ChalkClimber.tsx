import { useState, type CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'
import { limbPath, type JointPair } from './pixelLimb'

type Palm = 'rest' | 'cup' | 'upright' | 'cover'
type Arm = { joints: JointPair; palm: Palm }
type ChalkPose = { name: string; near: Arm; far: Arm }

// Cuff → elbow → wrist, in the same 40 × 52 pixel grid as the portrait.
const poses: ChalkPose[] = [
  { name: 'idle', near: { joints: [[11,32], [14,33]], palm: 'rest' }, far: { joints: [[29,31], [27,33]], palm: 'rest' } },
  { name: 'dip', near: { joints: [[12,32], [16,31]], palm: 'cup' }, far: { joints: [[32,29], [31,32]], palm: 'rest' } },
  { name: 'lift', near: { joints: [[12,32], [17,30]], palm: 'cup' }, far: { joints: [[29,31], [25,29]], palm: 'cup' } },
  { name: 'brush', near: { joints: [[13,32], [19,29]], palm: 'cup' }, far: { joints: [[28,30], [23,27]], palm: 'cup' } },
  { name: 'open', near: { joints: [[10,31], [15,28]], palm: 'upright' }, far: { joints: [[30,31], [27,27]], palm: 'upright' } },
  { name: 'clap', near: { joints: [[13,31], [20,28]], palm: 'upright' }, far: { joints: [[28,31], [23,28]], palm: 'upright' } },
  { name: 'cough', near: { joints: [[12,33], [17,32]], palm: 'rest' }, far: { joints: [[29,27], [25,22]], palm: 'cover' } },
]

const handShape: Record<Palm, string> = {
  rest: 'M-1 -1h3v1h1v2H0v-1h-1z',
  cup: 'M-1 -1h2v-1h1v1h2v2H2v1H0V1h-1z',
  upright: 'M-1 0v-2h1v-2h2v4h1v1H0v1h-1z',
  cover: 'M-1 0v-2h1v-1h3v2H2v2H0v1h-1z',
}

function ChalkArm({ arm, far = false }: { arm: Arm; far?: boolean }) {
  const side = far ? -1 : 1
  const [x, y] = arm.joints[1]
  const stroke = limbPath([far ? 29 : 11, 29], arm.joints, 3)
  return <g>
    <path d={stroke} transform="translate(0 1)" fill={far ? '#ae795e' : '#cd9473'}/>
    <path d={stroke} fill={far ? '#dca581' : 'var(--pixel-skin)'}/>
    <g transform={`translate(${x} ${y}) scale(${side} 1)`}>
      <path d={handShape[arm.palm]} fill={far ? '#dfa986' : 'var(--pixel-skin)'}/>
      {arm.palm === 'upright' && <>
        <path d="M1-2h1v3H1z" fill={far ? '#ad765d' : '#cf9475'}/>
        <path d="M0-3h2v1H0z" fill={far ? '#dbd2bf' : '#f7e7ce'}/>
      </>}
      {arm.palm === 'cup' && <path d="M2-1h2v1H2z" fill="#f5dfc3"/>}
    </g>
  </g>
}

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
        <g className="pixel-chalk-head"><PixelTimHead/>
        <g className="pixel-cough-face">
          <path d="M17 14h3v2h-3zM24 14h3v2h-3zM21 18h3v2h-3z" fill="var(--pixel-skin)"/>
          <path d="M17 14h2v1h1v1h-3v-1h1zM24 14h2v1h1v1h-3v-1h1zM21 18h3v2h-3z" fill="#29263a"/>
        </g></g>
        <path d="M13 33h14v2H13zM25 32h4v2h-4z" fill="#243048"/>
        <path d="M18 33h3v2h-3z" fill="#98a5ac"/>
        <g className="pixel-chalkbag">
          <path d="M27 31h9v7h-1v3h-7v-1h-2v-7h1z" fill="#9c442f"/>
          <path d="M27 33h8v5h-2v2h-5v-1h-1z" fill="var(--pixel-chalkBag)"/>
          <path d="M27 31h9v3h-9z" fill="#28344f"/>
          <path d="M28 31h6v1h-6zM28 35h2v3h-2z" fill="#ffdea8"/>
          <path d="M34 35h2v1h1v2h-1v-1h-2z" fill="#364860"/>
        </g>
        {poses.map(({ name, near, far }) => <g key={name} className={`chalk-pose pose-${name}`}>
          <ChalkArm arm={far} far/>
          <ChalkArm arm={near}/>
        </g>)}
        </g>
      </g>
      <g className="pixel-chalk-cloud" fill="#fffdf7">
        <path className="chalk-puff puff-left" d="M17 25h2v1h1v2h-3v-1h-1v-1h1zM14 27h1v1h-1z"/>
        <path className="chalk-puff puff-right" d="M23 25h3v1h1v1h-1v1h-3v-1h-1v-1h1zM28 25h1v1h-1z"/>
        <path className="chalk-puff puff-up" d="M20 23h2v-1h1v2h1v1h-3v1h-2v-2h1zM24 21h1v1h-1z"/>
      </g>
      <g className="pixel-cough-puff" fill="#fff" stroke="#a9bad9" strokeWidth=".3"><path d="M30 19h2v2h-2zM33 17h2v2h-2zM34 22h1v1h-1z"/></g>
    </svg>
    <span className="climber-name" aria-hidden="true">{siteConfig.profile.name}</span>
  </button>
}
