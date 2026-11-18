// Animate the dark snapshot in both directions, in viewport coordinates around the dock button.
function waveKeyframes(x: number, y: number, width: number, height: number) {
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 8
  const amplitude = Math.min(60, Math.min(width, height) * 0.065)
  const directions = Array.from({ length: 128 }, (_, i) => {
    const angle = 2 * Math.PI * i / 128
    return { angle, dx: Math.cos(angle), dy: Math.sin(angle) }
  })
  return Array.from({ length: 17 }, (_, i) => {
    const t = i / 16
    const progress = 0.38 * t + 0.62 * t * t * (3 - 2 * t)
    const crest = amplitude * Math.sin(Math.PI * progress)
    const points = directions.map(({ angle, dx, dy }) => {
      const waves = Math.sin(7 * angle - 5 * t) + 0.42 * Math.sin(11 * angle + 7 * t)
      const distance = Math.max(0, radius * progress + crest * waves)
      return `${(x + dx * distance).toFixed(1)}px ${(y + dy * distance).toFixed(1)}px`
    })
    return `${100 * t}% { clip-path: polygon(${points.join(',')}); }`
  }).join('\n')
}

export type ThemeRipple = { aim: (dark: boolean) => void; stop: () => void }

export function startThemeRipple(button: HTMLButtonElement, toDark: boolean, paint: (dark: boolean) => void, onDone: () => void): ThemeRipple | null {
  const root = document.documentElement
  const bounds = button.getBoundingClientRect()
  const style = document.createElement('style')
  style.textContent = `@keyframes dock-theme-wave {${waveKeyframes(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, window.innerWidth, window.innerHeight)}}`
  document.head.append(style)
  root.dataset.themeWave = toDark ? 'out' : 'in'
  let desired = toDark
  let ended = false
  let ready = false
  let animation: Animation | undefined
  let transition: ViewTransition
  try {
    transition = document.startViewTransition(() => { if (!ended) paint(toDark) })
  } catch {
    style.remove()
    delete root.dataset.themeWave
    paint(toDark)
    return null
  }

  // A captured document sends pointer events to <html> until its snapshots are released.
  function overButton(event: MouseEvent) {
    return event.target === root && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
  }
  function forwardClick(event: MouseEvent) { if (overButton(event)) button.click() }
  function preserveFocus(event: PointerEvent) { if (overButton(event)) event.preventDefault() }
  function finish() {
    if (ended) return
    ended = true
    paint(desired)
    delete root.dataset.themeWave
    style.remove()
    document.removeEventListener('click', forwardClick, true)
    document.removeEventListener('pointerdown', preserveFocus, true)
    window.removeEventListener('resize', stop)
    onDone()
  }
  function stop() { transition.skipTransition(); finish() }
  function aim(dark: boolean) {
    desired = dark
    if (animation) {
      if (animation.playState === 'finished') stop()
      else animation.updatePlaybackRate(dark === toDark ? 1 : -1)
    } else if (ready && dark !== toDark) stop()
  }
  document.addEventListener('click', forwardClick, true)
  document.addEventListener('pointerdown', preserveFocus, true)
  window.addEventListener('resize', stop)
  void transition.ready.then(() => {
    if (ended) return
    ready = true
    animation = document.getAnimations?.().find(a => 'animationName' in a && a.animationName === 'dock-theme-wave')
    aim(desired)
    // Commit the requested endpoint before the snapshots disappear after a reversal.
    void animation?.finished.then(() => { if (!ended) paint(desired) }, () => {})
  }, finish)
  void transition.finished.then(finish, finish)
  return { aim, stop }
}
