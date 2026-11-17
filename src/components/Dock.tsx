import { ArrowUpRight, Gamepad2, Github, LayoutGrid, Layers3, Linkedin, Mail } from 'lucide-react'
import { Fragment, useEffect, useRef, useSyncExternalStore, type ComponentType } from 'react'
import { m, LazyMotion, domAnimation, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import type { PortfolioConfig } from '../content/site'
import { emailUrl, externalUrl, githubProfile } from '../lib/links'
import { dockMagnification } from '../lib/dock'
import { CLIMB_NAME } from '../game/climber'

type DockIcon = ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
type DockEntry = { label: string; accessibleLabel?: string; href?: string; onClick?: () => void; Icon: DockIcon; color: string; external?: boolean; current?: boolean }

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
      : <button className="dock-item" onClick={entry.onClick} aria-label={entry.accessibleLabel ?? entry.label}>{content}</button>}
  </m.div>
}

export function Dock({ profile, username, onPlay, onWork }: { profile: PortfolioConfig['profile']; username: string | null; onPlay: () => void; onWork: () => void }) {
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
    { label: 'GitHub', href: githubProfile(username), Icon: Github, color: 'ink' },
    { label: 'LinkedIn', href: externalUrl(profile.linkedinUrl), Icon: Linkedin, color: 'linkedin' },
    { label: 'Email', href: emailUrl(profile.email), Icon: Mail, color: 'mail' },
  ].filter((item) => item.href).map((item): DockEntry => ({ ...item, href: item.href!, external: item.label !== 'Email', accessibleLabel: `${item.label} ${item.label === 'Email' ? '(opens your email app)' : '(opens in a new tab)'}` }))
  const entries: DockEntry[] = [
    { label: 'Overview', href: '#overview', Icon: LayoutGrid, color: 'overview', current: true },
    { label: 'Work', onClick: onWork, Icon: Layers3, color: 'work' },
    { label: CLIMB_NAME, accessibleLabel: `Play ${CLIMB_NAME}`, onClick: onPlay, Icon: Gamepad2, color: 'play' },
    ...external,
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
    {entries.map((entry, index) => <Fragment key={entry.label}>
      {index === 3 && <span className="dock-divider" aria-hidden="true"/>}
      <DockItem entry={entry} index={index} pointerX={pointerX} focusIndex={focusIndex} enabled={enabled}/>
    </Fragment>)}
  </nav></LazyMotion>
}
