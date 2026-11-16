import type { CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'

export function PixelRunner() {
  const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties
  return <svg className="pixel-runner" style={colors} viewBox="0 0 48 54" fill="none" shapeRendering="crispEdges" aria-hidden="true">
    <path d="M9 49h29v2H9zM14 51h18v1H14z" fill="#edcfbb"/>
    <g className="runner-body">
      <g className="runner-back-leg">
        <path d="M19 32h7v8h-5v-4h-2z" fill="var(--pixel-trousers)"/>
        <path d="M21 39h5v5h-3v3h-8v-4h6z" fill="var(--pixel-skin)"/>
        <path d="M10 43h7v3h6v3H10z" fill="#ff7140"/><path d="M9 48h15v2H9z" fill="#fff"/>
      </g>
      <g className="runner-back-arm">
        <path d="M25 24h4v7h-6v-4h2z" fill="var(--pixel-skin)"/>
        <path d="M22 27h4v4h-4z" fill="var(--pixel-skin)"/>
      </g>
      <path d="M14 21h13v2h4v6h-4v7H14v-7h-4v-6h4z" fill="var(--pixel-shirt)"/>
      <path d="M15 23h2v10h-2zM11 24h3v2h-3z" fill="#a1b9ff"/>
      <path d="M24 25h2v10h-2z" fill="#142d86" opacity=".45"/>
      <path d="M18 20h6v3h-6z" fill="var(--pixel-skin)"/>
      <PixelTimHead/>
      <g className="runner-front-leg">
        <path d="M14 33h8v6h-3v3h-5z" fill="var(--pixel-trousers)"/>
        <path d="M14 40h5v3h8v5h-5v-3h-8z" fill="var(--pixel-skin)"/>
        <path d="M23 44h7v2h4v3H22v-3h1z" fill="#ff7140"/><path d="M22 48h13v2H22z" fill="#fff"/>
      </g>
      <g className="runner-front-arm">
        <path d="M10 27h4v7h7v-5h4v8H11v-2h-1z" fill="var(--pixel-skin)"/>
        <path d="M21 31h4v2h-4z" fill="#20273a"/><path d="M22 31h2v1h-2z" fill="#a1b9ff"/>
      </g>
    </g>
  </svg>
}
