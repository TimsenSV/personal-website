import { PixelLampHousing } from './PixelHeadlamp'
import { limbPath, type JointPair, type Point } from './pixelLimb'

type LampFrame = {
  pose: 'reach' | 'grip' | 'draw' | 'lift' | 'fit'
  arm: JointPair
  lamp?: readonly [x: number, y: number, angle: number]
}

// Points use the head's coordinates, so the arm and its lamp share the sprite's tilt and bounce.
const gestures = {
  register: {
    shoulder: [26, 25],
    frames: [
      { pose: 'reach', arm: [[25, 32], [19, 35]] },
      { pose: 'grip', arm: [[23, 34], [14, 33]], lamp: [14, 34, -56] },
      { pose: 'draw', arm: [[24, 32], [18, 27]], lamp: [19, 25, -44] },
      { pose: 'lift', arm: [[30, 25], [28, 18]], lamp: [31, 16, -23] },
      { pose: 'fit', arm: [[34, 22], [30, 14]] },
    ],
  },
  runner: {
    shoulder: [10, 26],
    frames: [
      { pose: 'reach', arm: [[6, 30], [9, 33]] },
      { pose: 'grip', arm: [[7, 33], [12, 34]], lamp: [13, 35, -60] },
      { pose: 'draw', arm: [[11, 33], [18, 30]], lamp: [20, 29, -45] },
      { pose: 'lift', arm: [[19, 28], [25, 20]], lamp: [28, 18, -23] },
      { pose: 'fit', arm: [[22, 25], [30, 14]] },
    ],
  },
} satisfies Record<'register' | 'runner', { shoulder: Point; frames: LampFrame[] }>

export function PixelLampGesture({ sprite }: { sprite: keyof typeof gestures }) {
  const { shoulder, frames } = gestures[sprite]
  return <g className="pixel-lamp-gesture">
    {frames.map(({ pose, arm, lamp }: LampFrame) => {
      const [x, y] = arm[1]
      return <g key={pose} data-lamp-pose={pose} style={{ display: `var(--lamp-pose-${pose}, none)` }}>
        <path d={limbPath(shoulder, arm, 4)} fill="var(--pixel-skin)"/>
        {lamp && <g className="pixel-lamp-carried" transform={`translate(${lamp[0]} ${lamp[1]}) rotate(${lamp[2]})`}><PixelLampHousing/></g>}
        <path d={`M${x - 1} ${y - 2}h3v1h1v2h-4z`} fill="#f4c49c"/>
      </g>
    })}
  </g>
}
