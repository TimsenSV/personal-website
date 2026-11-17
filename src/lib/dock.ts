/** Smooth, finite falloff: the hovered icon and its two neighbours form a wave. */
export function dockMagnification(distance: number) {
  if (!Number.isFinite(distance) || Math.abs(distance) >= 140) return 0
  return 28 * ((Math.cos(Math.PI * distance / 140) + 1) / 2)
}
