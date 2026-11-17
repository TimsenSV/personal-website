export type Point = readonly [number, number]
export type JointPair = readonly [Point, Point]

// Stamp each jointed limb on whole pixels so diagonal arms and legs share
// the same edges and pixel size as the face.
export function limbPath(root: Point, [joint, tip]: JointPair, width: number) {
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
