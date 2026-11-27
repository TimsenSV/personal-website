const poses = [
  [0, 'stowed'],
  [64, 'reach'],
  [210, 'grip'],
  [375, 'draw'],
  [545, 'lift'],
  [715, 'fit'],
  [900, 'mounted'],
  [1120, 'lit'],
] as const
const duration = poses[poses.length - 1][0]

export function createThemeLighting(dark: boolean) {
  const root = document.documentElement
  let position: number = dark ? duration : 0
  let frame = 0

  function showPose() {
    let index = poses.length - 1
    while (position < poses[index][0]) index -= 1
    const pose = poses[index][1]
    if (root.dataset.themeLighting !== pose) root.dataset.themeLighting = pose
  }

  function hold() {
    cancelAnimationFrame(frame)
    showPose()
  }

  function sync(next: boolean) {
    cancelAnimationFrame(frame)
    position = next ? duration : 0
    delete root.dataset.themeLighting
  }

  function aim(next: boolean) {
    const end = next ? duration : 0
    if (position === end) { sync(next); return }
    hold()
    const start = position
    const direction = next ? 1 : -1
    const startedAt = performance.now()
    function advance(now: number) {
      position = Math.max(0, Math.min(duration, start + (now - startedAt) * direction))
      if (position === end) { sync(next); return }
      showPose()
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
  }

  return { hold, aim, sync }
}
