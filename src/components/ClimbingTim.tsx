import { memo, type CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import type { ClimbingPose } from '../game/climbMotion'
import { PixelTimHead } from './PixelTimHead'

type Point = readonly [number, number]
type JointPair = readonly [Point, Point]
type Drawing = {
  body: Point
  frontArm: JointPair; backArm: JointPair
  frontLeg: JointPair; backLeg: JointPair
}

// Elbow and palm, knee and toe, in the same pixel grid as the shared face.
// The leading palm rests at (30, 8) across the planted poses.
const poses: Record<ClimbingPose, Drawing> = {
  hang:  { body: [-1, -1], frontArm: [[33,18],[30,8]], backArm: [[7,18],[12,9]], frontLeg: [[34,38],[28,46]], backLeg: [[12,42],[8,46]] },
  load:  { body: [-2, -5], frontArm: [[34,17],[30,8]], backArm: [[5,16],[12,9]], frontLeg: [[33,29],[27,38]], backLeg: [[7,34],[11,42]] },
  reach: { body: [-3, -1], frontArm: [[30,17],[35,6]], backArm: [[7,26],[2,20]], frontLeg: [[27,37],[21,45]], backLeg: [[9,40],[1,45]] },
  catch: { body: [0, 0], frontArm: [[34,18],[30,8]], backArm: [[8,17],[14,11]], frontLeg: [[34,34],[31,43]], backLeg: [[11,38],[4,37]] },
  slip:  { body: [3, 1], frontArm: [[34,19],[30,8]], backArm: [[9,31],[3,27]], frontLeg: [[34,43],[37,52]], backLeg: [[16,44],[10,51]] },
  boost: { body: [-2,-2], frontArm: [[30,15],[35,4]], backArm: [[4,23],[0,17]], frontLeg: [[34,30],[31,39]], backLeg: [[10,39],[2,35]] },
  fall:  { body: [0,0], frontArm: [[36,21],[39,15]], backArm: [[4,18],[2,12]], frontLeg: [[32,37],[36,45]], backLeg: [[9,39],[3,35]] },
  hero:  { body: [0,0], frontArm: [[34,21],[32,12]], backArm: [[7,29],[15,31]], frontLeg: [[27,40],[30,47]], backLeg: [[15,40],[12,47]] },
}

// Stamp each jointed limb on whole pixels so diagonal arms and legs share
// the same edges and pixel size as the face.
function limbPath(root: Point, [joint, tip]: JointPair, width: number) {
  const pixels: string[] = []
  function segment(a: Point, b: Point) {
    const steps = Math.max(1, Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]))
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(a[0] + (b[0] - a[0]) * i / steps) - 2
      const y = Math.round(a[1] + (b[1] - a[1]) * i / steps) - 2
      pixels.push(`M${x} ${y}h${width}v${width}h-${width}z`)
    }
  }
  segment(root, joint)
  segment(joint, tip)
  return pixels.join('')
}

function Arm({ root, joints, front }: { root: Point; joints: JointPair; front?: boolean }) {
  const [x, y] = joints[1]
  return <g className={front ? 'climb-arm-right' : undefined}>
    <path d={limbPath(root, joints, 4)} fill={front ? 'var(--pixel-skin)' : '#c18b71'}/>
    <g transform={`translate(${x - 2} ${y - 3})`}>
      <path d="M1 0h3v1h1v4H0V1h1z" fill={front ? '#f5c6a0' : '#d7a182'}/>
      <path d="M1 0h3v2H0V1h1z" fill="#fff4da"/>
    </g>
  </g>
}

function Leg({ root, joints, front }: { root: Point; joints: JointPair; front?: boolean }) {
  const [x,y] = joints[1]
  return <g>
    <path d={limbPath(root, joints, 5)} fill={front ? 'var(--pixel-trousers)' : '#242d43'}/>
    <path d={`M${joints[0][0] - 2} ${joints[0][1] - 1}h3v2h-3z`} fill="#57617b"/>
    <g transform={`translate(${x - 3} ${y - 1})`}>
      <path d="M1 0h5v2h3v1h2v3H0V2h1z" fill="#1a2033"/>
      <path d="M2 1h3v2H2zM7 3h2v1H7z" fill="#ebaf68"/>
      <path d="M0 5h11v1H0z" fill="#8895ac"/>
    </g>
  </g>
}

const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties

export const ClimbingTim = memo(function ClimbingTim({ pose }: { pose: ClimbingPose }) {
  const { body: [x,y], frontArm, backArm, frontLeg, backLeg } = poses[pose]
  return <g className={`climb-tim pose-${pose}`} style={colors} shapeRendering="crispEdges">
    <Leg root={[17+x,34+y]} joints={backLeg}/>
    <Arm root={[13+x,24+y]} joints={backArm}/>
    <Leg root={[23+x,34+y]} joints={frontLeg} front/>
    <g transform={`translate(${x} ${y})`}>
      <path d="M14 21h12v2h4v6h-4v7H14v-7h-4v-6h4z" fill="var(--pixel-shirt)"/>
      <path d="M14 21h4v2h-4zM10 24h2v4h-2z" fill="#b4d1ff"/>
      <path d="M23 26h3v9H15v-2h7z" fill="#2343c3"/>
      <path d="M18 19h6v4h-6z" fill="#c68e74"/>
      <PixelTimHead/>
      <path d="M14 34h13v2H14z" fill="#20273a"/>
      <path d="M24 33h8v6h-2v2h-5v-2h-1z" fill="var(--pixel-chalkBag)"/>
      <path d="M24 32h8v2h-8zM26 35h2v3h-2z" fill="#ffefcc"/>
    </g>
    <Arm root={[27+x,24+y]} joints={frontArm} front/>
  </g>
})
