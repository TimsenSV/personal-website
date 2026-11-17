import { useEffect, useRef } from 'react'

/** Reveal the book artwork as touch users scroll through the reading area. */
export function useScrollPreview() {
  const ref = useRef<HTMLButtonElement>(null)
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
      if (!touch.matches || reduced.matches) return
      observer = new IntersectionObserver(([entry]) => {
        if (current !== generation) return
        element!.toggleAttribute('data-scroll-active', entry.isIntersecting && entry.intersectionRatio >= .55)
      }, { rootMargin: `${-window.innerHeight * .3}px 0px ${-window.innerHeight * .4}px 0px`, threshold: [.55] })
      observer.observe(element!)
    }
    observe()
    touch.addEventListener('change', observe)
    reduced.addEventListener('change', observe)
    window.addEventListener('resize', observe)
    return () => {
      generation++
      observer?.disconnect()
      element.removeAttribute('data-scroll-active')
      touch.removeEventListener('change', observe)
      reduced.removeEventListener('change', observe)
      window.removeEventListener('resize', observe)
    }
  }, [])
  return ref
}
