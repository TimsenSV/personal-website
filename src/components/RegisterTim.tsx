import { memo, useId, type CSSProperties } from 'react'
import { PixelHeadlamp } from './PixelHeadlamp'
import { PixelLampGesture } from './PixelLampGesture'
import { PixelTimHead } from './PixelTimHead'
import { limbPath, type JointPair, type Point } from './pixelLimb'
import { siteConfig } from '../content/site'

type TugPose = {
  name: string
  hip: Point
  tilt?: number
  seated?: boolean
  backArm: JointPair
  frontArm: JointPair
  backLeg: JointPair
  frontLeg: JointPair
}

// Fingers stay on the same paper edge as the hips shift back. Only the slip releases them.
const frames: TugPose[] = [
  { name: 'brace', hip: [20,32], backArm: [[13,24],[5,23]], frontArm: [[17,28],[6,26]], backLeg: [[22,39],[29,46]], frontLeg: [[13,39],[10,46]] },
  { name: 'lean', hip: [22,32], backArm: [[14,24],[5,23]], frontArm: [[18,28],[6,26]], backLeg: [[26,39],[31,46]], frontLeg: [[15,38],[10,46]] },
  { name: 'heave', hip: [25,33], backArm: [[15,24],[5,23]], frontArm: [[19,29],[6,26]], backLeg: [[28,39],[32,46]], frontLeg: [[19,38],[11,46]] },
  { name: 'slip', hip: [29,36], tilt: 18, backArm: [[26,23],[26,19]], frontArm: [[22,26],[15,25]], backLeg: [[34,41],[36,46]], frontLeg: [[19,38],[13,39]] },
  { name: 'fall', hip: [26,40], tilt: 40, backArm: [[36,36],[41,43]], frontArm: [[24,28],[18,22]], backLeg: [[29,43],[35,46]], frontLeg: [[17,38],[14,33]] },
  { name: 'land', hip: [24,44], tilt: 64, seated: true, backArm: [[41,38],[47,43]], frontArm: [[26,33],[20,29]], backLeg: [[18,41],[13,42]], frontLeg: [[16,37],[10,39]] },
  { name: 'skid', hip: [24,44], tilt: 48, seated: true, backArm: [[39,41],[44,44]], frontArm: [[25,36],[18,33]], backLeg: [[17,42],[9,46]], frontLeg: [[16,42],[11,45]] },
  { name: 'reach', hip: [23,34], backArm: [[17,25],[9,24]], frontArm: [[18,31],[10,28]], backLeg: [[26,39],[30,46]], frontLeg: [[14,39],[11,46]] },
  { name: 'ride', hip: [23,30], backArm: [[14,22],[5,23]], frontArm: [[17,27],[6,26]], backLeg: [[31,33],[36,28]], frontLeg: [[27,40],[34,39]] },
  { name: 'stride', hip: [23,31], backArm: [[29,26],[28,20]], frontArm: [[13,27],[8,23]], backLeg: [[30,38],[36,34]], frontLeg: [[14,36],[9,46]] },
  { name: 'passing', hip: [21,32], backArm: [[22,28],[18,30]], frontArm: [[16,29],[13,26]], backLeg: [[16,36],[22,40]], frontLeg: [[22,39],[24,46]] },
  { name: 'step', hip: [20,31], backArm: [[13,26],[9,23]], frontArm: [[24,27],[28,23]], backLeg: [[12,37],[8,46]], frontLeg: [[25,36],[32,34]] },
]
const frameWidth = 58
// Leave room for the light outside the viewport without showing adjacent poses.
const frameStride = 144
const spriteStyle = {
  ...Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => ['--pixel-' + key, value])),
  ...Object.fromEntries(frames.map(({ name }, index) => ['--frame-' + name, -index * frameStride + 'px'])),
} as CSSProperties

function Boot({ toe: [x, y] }: { toe: Point }) {
  return <g transform={`translate(${x - 5} ${y - 2})`}>
    <path d="M4 0h4v3H7v2H0V3h3V2h1z" fill="#222b3d"/>
    <path d="M3 2h3v1H3z" fill="#e5bb78"/><path d="M0 5h8v1H0z" fill="#727f95"/>
  </g>
}

export const RegisterTim = memo(function RegisterTim() {
  const torso = useId()
  const chalkBag = useId()
  return <svg className="register-tim" viewBox={`0 0 ${frameWidth} 53`} style={spriteStyle} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <defs><g id={torso}>
      <path d="M-6-14H3v2h4v5H4v9H-6v-7h-4v-6h4z" fill="var(--pixel-shirt)"/>
      <path d="M-7-12h4v2h-4z" fill="#afcaff"/><path d="M2-6h3v7H-5v-2h7z" fill="#2845ab"/>
      <path d="M-6 0H5v3H-6z" fill="var(--pixel-trousers)"/>
      <g transform="translate(20 -33) scale(-1 1)"><PixelTimHead/><PixelHeadlamp/><PixelLampGesture sprite="register"/></g>
    </g><g id={chalkBag}>
      <path d="M4-2h5v5H7v2H4z" fill="var(--pixel-chalkBag)"/>
      <path d="M4-3h5v2H4z" fill="#333f56"/>
    </g></defs>
    <g className="tug-strip">{frames.map(({ name, hip: [x, y], tilt = 0, seated, backArm, frontArm, backLeg, frontLeg }, index) => {
      const radians = tilt * Math.PI / 180
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)
      const shoulder = (dx: number, dy: number): Point => [
        Math.round(x + dx * cos - dy * sin),
        Math.round(y + dx * sin + dy * cos),
      ]
      return <g key={name} transform={`translate(${index * frameStride} 0)`}>
        <path d={limbPath([x+2,y+2],backLeg,4)} fill="#293449"/><Boot toe={backLeg[1]}/>
        <path d={limbPath(shoulder(-1, -9),backArm,3)} fill="#c58e6e"/>
        <path d={limbPath([x-3,y+1],frontLeg,5)} fill="var(--pixel-trousers)"/><Boot toe={frontLeg[1]}/>
        <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
          <use href={'#' + torso}/>
          <use href={'#' + chalkBag} x={seated ? -2 : 0} y={seated ? -5 : 0}/>
        </g>
        <g className="register-tug-arm">
          <path d={limbPath(shoulder(-6, -8),frontArm,4)} fill="var(--pixel-skin)"/>
          <rect x={frontArm[1][0]-3} y={frontArm[1][1]-2} width="4" height="3" fill="#f4c49c"/>
        </g>
      </g>
    })}</g>
  </svg>
})
