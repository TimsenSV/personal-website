import { useId } from 'react'
import { holds } from '../game/boulder'

const wall = 'M28 24L218 10 254 34 244 124 263 148 251 250 51 274 29 247 41 147 18 118Z'
const placements = holds.map(({ x, y, rotation }) => ({ x: 25 + x * 2.23, y: 14 + y * 2.55, rotation }))
const route = placements.slice(0, 6).map(({ x, y }) => `${x},${y}`).join(' ')

function Grip({ shape }: { shape: 'jug' | 'pinch' | 'rail' }) {
  return <g>
    {shape === 'jug' ? <>
      <path d="M-20 1Q-21-8-10-12Q4-17 15-9Q24-3 18 6Q11 15-3 13Q-18 13-20 1Z" fill="#2845b5"/>
      <path d="M-20-2Q-20-11-8-14Q4-18 15-10Q21-5 18 1Q9 9-3 8Q-17 9-20-2Z" fill="#4669f6"/>
      <path d="M-14-3Q-9-10 0-10Q8-10 13-6Q2-9-4-5Q-9-1-14-3Z" fill="#b5caff"/>
      <path d="M-12-2Q-3-8 9-6Q0-6-5-1Q-10 2-12-2Z" fill="#263fa8"/>
    </> : shape === 'pinch' ? <>
      <path d="M-16 0L-9-11 6-14 17-4 13 9-3 13-16 7Z" fill="#2843a9"/>
      <path d="M-16-2L-8-13 7-15 16-5 5 3-12 5Z" fill="#6686ff"/>
      <path d="M-12 5L5 3 16-5 12 6-2 10Z" fill="#3f60df"/>
      <path d="M-13-4L-7-11 4-13 0-10Z" fill="#b5caff"/>
    </> : <>
      <path d="M-21 0Q-12-10 13-8Q22-8 21-1Q15 7-10 9Q-19 10-21 4Z" fill="#2a46ae"/>
      <path d="M-21 0Q-13-11 13-10Q20-10 20-5Q11 2-10 5Q-19 7-21 2Z" fill="#5576f9"/>
      <path d="M-15-1Q-5-7 12-7" stroke="#bed1ff" strokeWidth="2" strokeLinecap="round"/>
    </>}
    <circle cx="3" cy="2" r="1.65" fill="#203881"/><circle cx="2.5" cy="1.5" r=".55" fill="#d7e5ff"/>
  </g>
}

export function BoulderPreview() {
  const bolts = useId()
  const shapes = ['jug', 'rail', 'pinch', 'jug', 'rail', 'jug', 'pinch', 'rail'] as const
  return <svg className="boulder-preview" viewBox="0 0 300 302" fill="none" aria-hidden="true">
    <defs><pattern id={bolts} width="17" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
      <circle cx="6" cy="7" r="1.1" fill="#7a839c" opacity=".48"/>
    </pattern></defs>
    <path d="M12 270L227 244 286 266 66 297Z" fill="#dee3ef"/>
    <path d="M13 267L224 243 283 263 65 292 13 274Z" fill="#9eaac7"/>
    <path d="M13 267L225 242 283 262 65 285Z" fill="#b8c4df"/>
    <path d="M119 255L172 274M214 249L252 264" stroke="#9daecc" strokeWidth="1.2"/>
    <path d={wall} transform="translate(5 4)" fill="#929cb5"/>
    <path d={wall} fill="var(--wall-base, #ebedf3)" stroke="var(--wall-edge, #b5bed2)" strokeWidth="1.2"/>
    <path d="M28 24L218 10 165 97 41 147 18 118Z" fill="var(--wall-lit, #f8f8fa)"/>
    <path d="M218 10L254 34 244 124 165 97Z" fill="var(--wall-side, #d5dbea)"/>
    <path d="M41 147L165 97 244 124 263 148 132 183Z" fill="var(--wall-middle, #e1e5f0)"/>
    <path d="M132 183L263 148 251 250 190 257Z" fill="var(--wall-shadow, #d0d8ea)"/>
    <path d="M28 24L165 97 218 10M41 147L165 97 244 124M132 183L190 257" stroke="#b8c2d5" strokeWidth="1"/>
    <path d={wall} fill={`url(#${bolts})`}/>
    <g strokeLinejoin="round" strokeWidth="1">
      <path d="M42 185L81 150 94 191 48 198Z" fill="#bbc5d9" stroke="#adb8ce"/>
      <path d="M42 185L81 150 69 179Z" fill="#f9faff"/><path d="M81 150L94 191 69 179Z" fill="#dbe2ee"/>
      <path d="M156 83L200 43 215 85 178 96Z" fill="#acb9d2" stroke="#acb8ce"/>
      <path d="M156 83L200 43 188 75Z" fill="#f7f9fd"/><path d="M200 43L215 85 188 75Z" fill="#d5deee"/>
    </g>
    <polyline className="gym-route" points={route} pathLength="1" stroke="#7085ca" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
    {placements.map(({ x, y, rotation }, i) => <g key={holds[i].id} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${i > 5 ? .52 : i === 0 || i === 5 ? 1 : .8})`}>
      <Grip shape={shapes[i]}/>
    </g>)}
    <g transform="translate(58 261) rotate(-7)">
      <rect width="31" height="9" rx="1" fill="#ffca8d"/>
      <text x="4" y="6.6" fill="#68472d" fontSize="6" fontFamily="monospace" letterSpacing=".7">START</text>
    </g>
  </svg>
}
