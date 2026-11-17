import { useEffect, useRef } from 'react'

/** Touch previews follow the reading area; character loops run only while visible. */
export function useScrollPreview<T extends HTMLElement = HTMLButtonElement>(area: 'reading' | 'viewport' = 'reading') {
  const ref = useRef<T>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || !window.matchMedia || !window.IntersectionObserver) return
    const touch = window.matchMedia('(max-width: 620px), (hover: none), (pointer: coarse)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | undefined
    let generation = 0
    function observe() {
      const current = ++generation
      observer?.disconnect()
      element!.removeAttribute('data-scroll-active')
      if (!touch.matches || reduced.matches || document.hidden) return
      const threshold = area === 'viewport' ? .2 : .55
      observer = new IntersectionObserver(([entry]) => {
        if (current !== generation) return
        element!.toggleAttribute('data-scroll-active', entry.isIntersecting && entry.intersectionRatio >= threshold)
      }, { rootMargin: area === 'viewport' ? '0px' : `${-window.innerHeight * .3}px 0px ${-window.innerHeight * .4}px 0px`, threshold: [threshold] })
      observer.observe(element!)
    }
    observe()
    touch.addEventListener('change', observe)
    reduced.addEventListener('change', observe)
    window.addEventListener('resize', observe)
    document.addEventListener('visibilitychange', observe)
    return () => {
      generation++
      observer?.disconnect()
      element.removeAttribute('data-scroll-active')
      touch.removeEventListener('change', observe)
      reduced.removeEventListener('change', observe)
      window.removeEventListener('resize', observe)
      document.removeEventListener('visibilitychange', observe)
    }
  }, [area])
  return ref
}
