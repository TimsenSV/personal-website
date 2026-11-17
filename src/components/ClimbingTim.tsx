import { memo, type CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'

export const ClimbingTim = memo(function ClimbingTim({ pose }: { pose: 'hang' | 'reach' | 'slip' | 'boost' | 'hero' }) {
  const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties
  return <g className={`climb-tim pose-${pose}`} style={colors} shapeRendering="crispEdges">
    {pose === 'boost' ? <g className="climb-tim-legs"><path d="M14 33h14v7h-8v-3h-3v6H9v-4h5z" fill="var(--pixel-trousers)"/><path d="M7 41h10v4H7zM22 38h7v2h3v3H22z" fill="#171c2c"/><path d="M7 45h10v1H7zM22 43h10v1H22z" fill="#94a2c3"/></g> : <g className="climb-tim-legs">
      <path d="M14 32h14v7h-5v7h-4V36h-2v7h-7v-4h4z" fill="var(--pixel-trousers)"/>
      <path d="M11 41h6v3h-9v-2h3zM19 44h6v2h3v3h-9z" fill="#171c2c"/>
      <path d="M8 44h9v1H8zM19 49h9v1h-9z" fill="#94a2c3"/>
    </g>}
    <path d="M14 21h13v2h4v6h-4v7H14v-7h-4v-6h4z" fill="var(--pixel-shirt)"/>
    <path d="M15 23h2v10h-2zM11 24h3v2h-3z" fill="#a1b9ff"/>
    <path d="M18 20h6v3h-6z" fill="var(--pixel-skin)"/>
    <PixelTimHead/>
    <g className="climb-arm-left"><path d={pose === 'hero' ? 'M10 25h4v7h-3v-2h-3v-6h2z' : 'M10 0h4v18h1v10h-4v-6h-1z'} fill="var(--pixel-skin)"/>{pose !== 'hero' && <path d="M10 0h4v2h-4z" fill="#fff"/>}</g>
    <g className="climb-arm-right"><path d={pose === 'boost' ? 'M27 24h4v6h-4v-2h-5v-4z' : pose === 'hero' ? 'M27 25h4v-5h4V9h-4v10h-4z' : 'M26 0h4v23h-3v5h-3v-9h2z'} fill="var(--pixel-skin)"/>{pose !== 'boost' && <path d={pose === 'hero' ? 'M31 8h4v3h-4z' : 'M26 0h4v2h-4z'} fill="#fff"/>}</g>
    <path d="M14 34h13v2H14z" fill="#20273a"/>
    <path d="M26 32h7v7h-1v2h-5v-2h-1z" fill="var(--pixel-chalkBag)"/>
    <path d="M26 32h7v2h-7zM29 36h2v3h-2z" fill="#fff5e6"/>
  </g>
})
