import { useId, type CSSProperties, type ReactNode } from 'react'

const previewLights = [
  { x: 49, y: 22, angle: -23, width: 1, reach: 1 },
  { x: 224, y: 16, angle: 16, width: 1, reach: 1.08 },
]
const gameLights = [
  { x: 56, y: 19, angle: -16, width: 1.65, reach: 2.12 },
  { x: 384, y: 19, angle: 16, width: 1.65, reach: 2.12 },
]

function FloodlightPivot({ x, y, angle, children }: { x: number; y: number; angle: number; children: ReactNode }) {
  const style = { '--floodlight-aim': `${angle}deg`, '--floodlight-turn': angle < 0 ? 1 : -1 } as CSSProperties
  return <g transform={`translate(${x} ${y})`}>
    <g className="boulder-floodlight-pivot" style={style}>{children}</g>
  </g>
}

export function BoulderFloodlights({ wallClip }: { wallClip?: string }) {
  const beam = useId()
  const lights = wallClip ? previewLights : gameLights

  return <g className="boulder-floodlights">
    <defs>
      <linearGradient id={beam} x1="0" y1="0" x2="0" y2="224" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff6d7" stopOpacity=".82"/>
        <stop offset=".24" stopColor="#ffe9b2" stopOpacity=".58"/>
        <stop offset=".68" stopColor="#ffe2a0" stopOpacity=".32"/>
        <stop offset="1" stopColor="#ffe2a0" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <g className="boulder-floodlight-beams" clipPath={wallClip ? `url(#${wallClip})` : undefined} fill={`url(#${beam})`}>
      {lights.map(({ x, y, angle, width, reach }) =>
        <FloodlightPivot key={x} x={x} y={y} angle={angle}>
          <g transform={`scale(${width} ${reach})`}>
            <path d="M-6 0H6L87 224H-87Z" opacity=".35"/>
            <path d="M-5 0H5L64 224H-64Z"/>
          </g>
        </FloodlightPivot>
      )}
    </g>
    <g shapeRendering="crispEdges">
      {lights.map(({ x, y, angle }) =>
        <FloodlightPivot key={x} x={x} y={y} angle={angle}>
          <path d="M-4-14H4v5H-4z" fill="#76819a"/>
          <path d="M-8-10H8v2h2v8H-10v-8h2z" fill="#192131" stroke="#8994aa"/>
          <path d="M-7-5H7v5H-7z" fill="#505b71"/>
          <g className="boulder-floodlight-lens">
            <path d="M-7-5H7v5H-7z" fill="#ffcb78"/>
            <path d="M-5-4H5v3H-5z" fill="#fff7d8"/>
          </g>
        </FloodlightPivot>
      )}
    </g>
  </g>
}
