import type { CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'

/** Four drawn poses per foot, each confined to its own lane. No rotating rigid legs. */
function RunningLeg({ side }: { side: 'left' | 'right' }) {
  return <g className={`runner-leg runner-leg-${side}`} transform={`translate(${side === 'left' ? 13 : 23} 35)`}>
    <g className="runner-leg-frame runner-contact">
      <path d="M1 0h4v8H4v5H1z" fill="var(--pixel-skin)"/>
      <path d="M0 12h5v1h3v2H0z" fill="#ff7140"/><path d="M0 15h8v1H0z" fill="#fff"/>
    </g>
    <g className="runner-leg-frame runner-push">
      <path d="M1 0h4v6H4v5H1z" fill="var(--pixel-skin)"/>
      <path d="M0 10h4v2h3v2h1v1H5v-1H2v-1H0z" fill="#ff7140"/><path d="M0 13h2v1h3v1h3v1H5v-1H2v-1H0z" fill="#fff"/>
    </g>
    <g className="runner-leg-frame runner-lift">
      <path d="M1 0h4v5H3v3H0V4h1z" fill="var(--pixel-skin)"/>
      <path d="M0 7h4v1h3v2H0z" fill="#ff7140"/><path d="M0 10h7v1H0z" fill="#fff"/>
    </g>
    <g className="runner-leg-frame runner-reach">
      <path d="M1 0h4v6H4v5H0V8h1z" fill="var(--pixel-skin)"/>
      <path d="M0 10h4v1h4v3H0z" fill="#ff7140"/><path d="M0 14h8v1H0z" fill="#fff"/>
    </g>
  </g>
}

export function PixelRunner() {
  const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties
  return <svg className="pixel-runner" style={colors} viewBox="0 0 48 54" fill="none" shapeRendering="crispEdges" aria-hidden="true">
    <path d="M9 49h29v2H9zM14 51h18v1H14z" fill="#edcfbb"/>
    <RunningLeg side="left"/>
    <RunningLeg side="right"/>
    <path d="M14 33h14v6h-5v-3h-4v3h-5z" fill="var(--pixel-trousers)"/>
    <g className="runner-body">
      <g className="runner-back-arm">
        <path d="M27 25h4v3h2v-2h-3v-3h4v2h2v8h-6v-2h-3z" fill="var(--pixel-skin)"/>
        <path d="M31 31h5v2h-5z" fill="#a26552" opacity=".22"/>
      </g>
      <path d="M14 21h13v2h4v6h-4v7H14v-7h-4v-6h4z" fill="var(--pixel-shirt)"/>
      <path d="M15 23h2v10h-2zM11 24h3v2h-3z" fill="#a1b9ff"/>
      <path d="M24 25h2v10h-2z" fill="#142d86" opacity=".45"/>
      <path d="M18 20h6v3h-6z" fill="var(--pixel-skin)"/>
      <PixelTimHead/>
      <g className="runner-front-arm">
        <path d="M10 27h4v5h6v-4h4v7H11v-2h-1z" fill="var(--pixel-skin)"/>
        <path d="M20 30h4v2h-4z" fill="#20273a"/><path d="M21 30h2v1h-2z" fill="#a1b9ff"/>
      </g>
    </g>
  </svg>
}
