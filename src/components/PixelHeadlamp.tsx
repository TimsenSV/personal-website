import { useId } from 'react'

export function PixelLampHousing({ worn = false }: { worn?: boolean }) {
  return <>
    <path d="M-6-3h6v1h2v5H0v1h-5V3h-2v-5h1z" fill="#58442f"/>
    <path d="M-5-2h5v1h2v3H0v1h-5z" fill="#dfac61"/>
    <path d="M-2-1h4v3h-4z" fill="#b49162"/>
    {worn && <path className="pixel-headlamp-lens" d="M-2-1h4v3h-4z" fill="#fff9da"/>}
  </>
}

export function PixelHeadlamp() {
  const glow = useId()

  return <g className="pixel-headlamp">
    <defs>
      <linearGradient id={glow} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="63" y2="0">
        <stop stopColor="#fff8d5" stopOpacity=".95"/>
        <stop offset=".25" stopColor="#ffecb0" stopOpacity=".69"/>
        <stop offset=".65" stopColor="#ffdd8b" stopOpacity=".29"/>
        <stop offset="1" stopColor="#ffdd8b" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <g transform="translate(31 11)">
      <g className="pixel-headlamp-beam" fill={`url(#${glow})`}>
        <path d="M0-1H4V-3H10V-5H18V-8H29V-11H42V-15H63V16H42V13H29V10H18V7H10V5H4V2H0Z" opacity=".46"/>
        <path d="M0-1H6V-2H14V-4H25V-6H39V-8H59V10H39V8H25V6H14V4H6V2H0Z"/>
      </g>
      <path d="M-18-1h6v1h7v-1h2v3h-9V1h-6z" fill="#34394f"/>
      <path d="M-16-1h5v1h-5z" fill="#8291ac"/>
      <PixelLampHousing worn/>
    </g>
  </g>
}
