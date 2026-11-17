// Small original bitmap alphabet. SVG stays crisp at any screen density, without a font download.
const glyphs: Record<string, string[]> = {
  G: ['01111','11000','11000','11011','11001','11001','01111'],
  R: ['11110','11001','11001','11110','11100','11010','11001'],
  I: ['111','010','010','010','010','010','111'],
  P: ['11110','11001','11001','11110','11000','11000','11000'],
  H: ['11001','11001','11001','11111','11001','11001','11001'],
  A: ['01110','11001','11001','11111','11001','11001','11001'],
  E: ['11111','11000','11000','11110','11000','11000','11111'],
  N: ['11001','11101','11101','11011','11011','11001','11001'],
  S: ['01111','11000','11000','01110','00011','00011','11110'],
  D: ['11110','11001','11001','11001','11001','11001','11110'],
  Y: ['11001','11001','01010','00100','00100','00100','00100'],
  O: ['01110','11001','11001','11001','11001','11001','01110'],
  B: ['11110','11001','11001','11110','11001','11001','11110'],
  T: ['11111','00100','00100','00100','00100','00100','00100'],
  '-': ['000','000','000','111','000','000','000'],
}

export function PixelType({ text, className = '' }: { text: string; className?: string }) {
  let offset = 0
  const paths = [...text].map((letter, index) => {
    const glyph = glyphs[letter]
    if (!glyph) { offset += 3; return null }
    const x = offset
    offset += glyph[0].length + 1
    return <path key={index} d={glyph.flatMap((line, y) => [...line].flatMap((pixel, dx) => pixel === '1' ? [`M${x + dx} ${y}h1v1h-1z`] : [])).join('')}/>
  })
  return <svg className={`pixel-type ${className}`} viewBox={`0 0 ${offset - 1} 7`} fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">{paths}</svg>
}

export function EnergyBar() {
  return <g className="climb-energy-bar" transform="translate(-19 -48)" shapeRendering="crispEdges">
    <path d="M0 3h4V0h30v3h4v15h-4v3H4v-3H0z" fill="#27365e"/>
    <path d="M4 3h30v15H4z" fill="#ffcf56"/><path d="M0 5h4v11H0zM34 5h4v11h-4z" fill="#ffe8a0"/>
    <path d="M13 3h12v15H13z" fill="#ff784e"/><path d="M20 4h4l-4 6h4l-7 7 2-6h-4z" fill="#fff9d8"/>
  </g>
}
