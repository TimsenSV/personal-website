import { useEffect, useRef, useState } from 'react'
import { startThemeRipple, type ThemeRipple } from '../lib/themeRipple'

const preferenceKey = 'timsen-theme'
const darkQuery = '(prefers-color-scheme: dark)'
const motionQuery = '(prefers-reduced-motion: reduce)'
function savedTheme() {
  try { return localStorage.getItem(preferenceKey) } catch { return null }
}
function systemDark() { return window.matchMedia?.(darkQuery).matches ?? false }
function paint(dark: boolean) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111318' : '#fafafa')
}

export function useColorTheme() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const target = useRef(dark)
  const explicit = useRef(false)
  const ripple = useRef<ThemeRipple | null>(null)
  useEffect(() => {
    const followPreference = () => {
      const saved = savedTheme()
      explicit.current = saved === 'dark' || saved === 'light'
      target.current = explicit.current ? saved === 'dark' : systemDark()
      ripple.current?.stop()
      paint(target.current)
      setDark(target.current)
    }
    const systemChanged = () => { if (!explicit.current) followPreference() }
    const storageChanged = (e: StorageEvent) => { if (e.key === preferenceKey || e.key === null) followPreference() }
    const motionChanged = (e: MediaQueryListEvent) => { if (e.matches) ripple.current?.stop() }
    const scheme = window.matchMedia?.(darkQuery)
    const motion = window.matchMedia?.(motionQuery)
    followPreference()
    scheme?.addEventListener('change', systemChanged)
    motion?.addEventListener('change', motionChanged)
    window.addEventListener('storage', storageChanged)
    return () => {
      scheme?.removeEventListener('change', systemChanged)
      motion?.removeEventListener('change', motionChanged)
      window.removeEventListener('storage', storageChanged)
      ripple.current?.stop()
    }
  }, [])

  function toggle(button: HTMLButtonElement) {
    const next = !target.current
    target.current = next
    explicit.current = true
    setDark(next)
    try { localStorage.setItem(preferenceKey, next ? 'dark' : 'light') } catch { /* The choice still applies in this tab. */ }
    if (ripple.current) { ripple.current.aim(next); return }
    if (!document.startViewTransition || window.matchMedia?.(motionQuery).matches) { paint(next); return }
    ripple.current = startThemeRipple(button, next, paint, () => { ripple.current = null })
  }
  return { dark, toggle }
}
