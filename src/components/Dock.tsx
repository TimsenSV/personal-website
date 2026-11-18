import { ArrowUpRight, FileText, Gamepad2, Github, LayoutGrid, Layers3, Linkedin, Mail } from 'lucide-react'
import { Fragment, useEffect, useRef, useSyncExternalStore, type ComponentType, type MouseEvent } from 'react'
import { m, LazyMotion, domAnimation, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import type { PortfolioConfig } from '../content/site'
import { emailUrl, externalUrl, githubProfile, spotifyPlaylist } from '../lib/links'
import { dockMagnification } from '../lib/dock'
import { CLIMB_NAME } from '../game/climber'
import { SpotifyMark } from './Icons'
import { useColorTheme } from '../hooks/useColorTheme'

type DockIcon = ComponentType<{ className?: string; size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
type DockEntry = { label: string; accessibleLabel?: string; href?: string; onClick?: (event: MouseEvent<HTMLButtonElement>) => void; Icon: DockIcon; color: string; external?: boolean; current?: boolean; pressed?: boolean }

function ThemeIcon() {
  return <svg className="theme-art" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <g fill="var(--theme-face)">
      <rect width="64" height="64" rx="16"/>
      <g className="theme-edge">
        <path d="M16 2V0C22 0 22 -4 23 -10C24 -19 31 -20 33 -12C35 -7 32 -3 37 -1C40 0 43 0 48 0V2Z"/>
      </g>
    </g>
    <svg className="theme-glyph" x="15" y="15" width="34" height="34" viewBox="0 0 32 32">
      <g className="theme-moon" fill="currentColor">
        <path d="M17.4 4.2a11.8 11.8 0 1 0 10.4 15.4 9.8 9.8 0 0 1-10.4-15.4Z"/>
        <path d="m24 4 .8 2.6 2.7.9-2.7.9L24 11l-.8-2.6-2.7-.9 2.7-.9Z"/>
        <circle cx="28" cy="13.5" r="1"/>
      </g>
      <g className="theme-sun" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="16" cy="16" r="5.5" fill="currentColor" stroke="none"/>
        <path d="M16 3v3m0 20v3M3 16h3m20 0h3M6.8 6.8 9 9m14 14 2.2 2.2m0-18.4L23 9M9 23l-2.2 2.2"/>
      </g>
    </svg>
  </svg>
}

const hoverQuery = '(min-width: 621px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const subscribe = (notify: () => void) => {
  const media = window.matchMedia?.(hoverQuery)
  media?.addEventListener('change', notify)
  return () => media?.removeEventListener('change', notify)
}
const canMagnify = () => window.matchMedia?.(hoverQuery).matches ?? false

function DockItem({ entry, index, pointerX, focusIndex, enabled }: { entry: DockEntry; index: number; pointerX: MotionValue<number>; focusIndex: MotionValue<number>; enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useTransform(() => {
    const pointer = pointerX.get()
    const focused = focusIndex.get()
    if (!enabled) return 0
    if (focused >= 0) return dockMagnification((index - focused) * 58)
    const bounds = ref.current?.getBoundingClientRect()
    return bounds ? dockMagnification(pointer - bounds.left - bounds.width / 2) : 0
  })
  const growth = useSpring(target, { stiffness: 350, damping: 28, mass: 0.65 })
  const width = useTransform(growth, (value) => `calc(var(--dock-size) + ${Math.max(0, value)}px)`)
  useEffect(() => { if (!enabled) growth.jump(0) }, [enabled, growth])
  const { Icon } = entry
  const content = <>
    <span className="dock-tooltip" aria-hidden="true">{entry.label}{entry.external ? ' ↗' : ''}</span>
    <span className={`dock-icon ${entry.color}`}><Icon size={27} strokeWidth={2.1} aria-hidden={true}/>{entry.external && <ArrowUpRight className="dock-external" size={10} aria-hidden="true"/>}</span>
    {entry.current && <span className="dock-indicator" aria-hidden="true"/>}
  </>
  return <m.div ref={ref} className="dock-slot" style={{ width }}>
    {entry.href ? <a className="dock-item" href={entry.href} target={entry.external ? '_blank' : undefined} rel={entry.external ? 'noopener noreferrer' : undefined} aria-label={entry.accessibleLabel ?? entry.label}>{content}</a>
      : <button type="button" className="dock-item" onClick={entry.onClick} aria-label={entry.accessibleLabel ?? entry.label} aria-pressed={entry.pressed} aria-haspopup={entry.pressed === undefined ? 'dialog' : undefined}>{content}</button>}
  </m.div>
}

export function Dock({ profile, username, playlistUrl, onPlay, onWork, onLegal }: { profile: PortfolioConfig['profile']; username: string | null; playlistUrl?: string | null; onPlay: () => void; onWork: () => void; onLegal: () => void }) {
  const theme = useColorTheme()
  const enabled = useSyncExternalStore(subscribe, canMagnify, () => false)
  const pointerX = useMotionValue(Infinity)
  const focusIndex = useMotionValue(-1)
  useEffect(() => {
    const reset = () => { pointerX.set(Infinity); focusIndex.set(-1) }
    window.addEventListener('blur', reset)
    window.addEventListener('resize', reset)
    return () => { window.removeEventListener('blur', reset); window.removeEventListener('resize', reset) }
  }, [pointerX, focusIndex])
  const external = [
    { label: 'Spotify', href: spotifyPlaylist(playlistUrl ?? null)?.url, Icon: SpotifyMark, color: 'spotify' },
    { label: 'GitHub', href: githubProfile(username), Icon: Github, color: 'ink' },
    { label: 'LinkedIn', href: externalUrl(profile.linkedinUrl), Icon: Linkedin, color: 'linkedin' },
    { label: 'Email', href: emailUrl(profile.email), Icon: Mail, color: 'mail' },
  ].filter((item) => item.href).map((item): DockEntry => ({ ...item, href: item.href!, external: item.label !== 'Email', accessibleLabel: `${item.label} ${item.label === 'Email' ? '(opens your email app)' : '(opens in a new tab)'}` }))
  const entries: DockEntry[] = [
    { label: 'Overview', href: '#overview', Icon: LayoutGrid, color: 'overview', current: true },
    { label: 'Work', onClick: onWork, Icon: Layers3, color: 'work' },
    { label: CLIMB_NAME, accessibleLabel: `Play ${CLIMB_NAME}`, onClick: onPlay, Icon: Gamepad2, color: 'play' },
    ...external,
    { label: 'Impressum & Privacy', onClick: onLegal, Icon: FileText, color: 'legal' },
    { label: theme.dark ? 'Switch to light mode' : 'Switch to dark mode', accessibleLabel: 'Dark mode', pressed: theme.dark, onClick: event => theme.toggle(event.currentTarget), Icon: ThemeIcon, color: 'theme-icon' },
  ]
  return <LazyMotion features={domAnimation} strict><nav className="dock" aria-label="Quick navigation" data-magnification={enabled ? 'on' : 'off'}
    onPointerMove={(event) => {
      if (!enabled || event.pointerType !== 'mouse') return
      focusIndex.set(-1)
      pointerX.set(event.clientX)
    }}
    onPointerLeave={() => pointerX.set(Infinity)}
    onPointerCancel={() => pointerX.set(Infinity)}
    onFocus={(event) => {
      if (!enabled || !event.target.matches('.dock-item:focus-visible')) return
      pointerX.set(Infinity)
      focusIndex.set([...event.currentTarget.querySelectorAll('.dock-item')].indexOf(event.target))
    }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) focusIndex.set(-1) }}>
    {entries.map((entry, index) => <Fragment key={entry.color}>
      {index === 3 && <span className="dock-divider" aria-hidden="true"/>}
      <DockItem entry={entry} index={index} pointerX={pointerX} focusIndex={focusIndex} enabled={enabled}/>
    </Fragment>)}
  </nav></LazyMotion>
}
