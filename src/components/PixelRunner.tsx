import type { CSSProperties } from 'react'
import { siteConfig } from '../content/site'
import { PixelTimHead } from './PixelTimHead'
import { limbPath, type JointPair, type Point } from './pixelLimb'

// Eight exposures per stride. The back leg is half a stride ahead and runs
// in its own screen lane so its foot stays distinct at this tiny size.
const stride: readonly JointPair[] = [
  [[4,6],[6,12]], [[3,8],[3,13]], [[0,8],[-2,12]], [[-3,6],[-6,8]],
  [[-2,4],[-6,3]], [[1,3],[-3,2]], [[4,3],[2,7]], [[6,4],[6,10]],
]
const swing: readonly JointPair[] = [
  [[-4,7],[1,8]], [[-3,7],[3,6]], [[0,7],[6,4]], [[2,7],[8,2]],
  [[3,6],[9,0]], [[2,6],[8,1]], [[-1,7],[5,4]], [[-3,7],[2,6]],
]
function Foot({ at: [x,y], lifted, far }: { at: Point; lifted: boolean; far: boolean }) {
  return <g transform={`translate(${x-3} ${y-2})`}>
    <path d="M1-1h4v4H1z" fill={far ? '#c9c9bb' : '#fff5d9'}/>
    <path d={lifted ? 'M0 1h4v2h3v2h3v2H6V6H3V5H0z' : 'M0 2h4v1h3v1h4v2H0z'} fill={far ? '#bf5636' : '#ff6736'}/>
    <path d={lifted ? 'M0 4h3v1h3v1h4v2H6V7H3V6H0z' : 'M0 5h11v2H0z'} fill="#fff1d6"/>
    <path d={lifted ? 'M6 7h4v1H6z' : 'M0 7h3v1H0zM8 7h3v1H8z'} fill="#684347"/>
  </g>
}
function RunnerLeg({ phase, far = false }: { phase: number; far?: boolean }) {
  const [knee, foot] = stride[phase]
  return <g transform={`translate(${far ? 13 : 25} 35)`}>
    <path d={limbPath([0,0],[knee,foot],4)} fill={far ? '#c88d6f' : 'var(--pixel-skin)'}/>
    <Foot at={foot} lifted={phase >= 3 && phase <= 5} far={far}/>
  </g>
}
function RunnerArm({ phase, far = false }: { phase: number; far?: boolean }) {
  const joints = swing[phase]
  const [x,y] = joints[1]
  return <g transform={`translate(${far ? 29 : 14} ${far ? 24 : 25})`}>
    <path d={limbPath([0,0], joints, 4)} fill={far ? '#ce9579' : 'var(--pixel-skin)'}/>
    <path d={`M${x-1} ${y-3}h3v1h2v3h-5z`} fill={far ? '#dba384' : '#f6c3a0'}/>
    {!far && <g transform={`translate(${x-3} ${y+1})`}><path d="M0 0h4v3H0z" fill="#283747"/><path d="M1 0h2v1H1z" fill="#98eee7"/></g>}
  </g>
}

const colors = Object.fromEntries(Object.entries(siteConfig.profile.pixelAvatar).map(([key, value]) => [`--pixel-${key}`, value])) as CSSProperties
function StrideFrames({ arms = false, far = false }: { arms?: boolean; far?: boolean }) {
  return <g>{stride.map((_, frame) => {
    const phase = (frame + (far ? 4 : 0)) % stride.length
    const style = { '--phase-shift': `${(frame - stride.length) * 90}ms` } as CSSProperties
    return <g key={frame} className={`runner-frame ${frame === 0 ? 'frame-start' : ''}`} style={style}>
      {arms ? <RunnerArm phase={phase} far={far}/> : <RunnerLeg phase={phase} far={far}/>}
    </g>
  })}</g>
}
export function PixelRunner() {
  return <svg className="pixel-runner" style={colors} viewBox="0 0 48 56" fill="none" shapeRendering="crispEdges" aria-hidden="true">
    <path className="runner-shadow" d="M7 52h29v1h4v1H11v-1H7z" fill="#d8b79f"/>
    <StrideFrames far/><StrideFrames/>
    <g className="runner-body">
      <StrideFrames arms far/>
      <path d="M14 32h13v3h2v4h-6v-2h-5v2h-7v-4h3z" fill="var(--pixel-trousers)"/>
      <path d="M12 35h3v3h-4v-1h1zM25 36h3v1h-3z" fill="#8290a4"/>
      <g transform="translate(2 0)">
        <path d="M15 20h4v3h4v-3h4v4h2v4h-2v6H12v-7h2z" fill="var(--pixel-shirt)"/>
        <path d="M15 21h2v5h-2v2h-2v-2h2zM23 20h3v2h-3z" fill="#e3f4e8"/>
        <path d="M27 25h2v3h-3v3h-4v2H12v-2h8v-2h4v-2h3z" fill="#ff8050"/>
        <path d="M23 24h3v1h-3z" fill="#f6efc7"/>
        <path d="M18 19h6v3h-2v1h-3v-1h-1z" fill="#d29774"/>
        <g transform="translate(2 -1)"><PixelTimHead/>
          <path d="M13 10h5v1h8v-1h3v2h-3v1h-9v-1h-4z" fill="#ffefc8"/>
          <path d="M13 11h3v2h-4v2h-4v-1h2v-2h3z" fill="#e57d49"/>
        </g>
      </g>
      <StrideFrames arms/>
    </g>
  </svg>
}
