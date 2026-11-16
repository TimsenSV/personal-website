import { ArrowUpRight, Gamepad2, Github, LayoutGrid, Layers3, Linkedin, Mail } from 'lucide-react'
import type { ComponentType, CSSProperties } from 'react'
import type { PortfolioConfig } from '../content/site'
import { emailUrl, externalUrl, githubProfile } from '../lib/links'

type DockIcon = ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
export function Dock({ profile, username, onPlay }: { profile: PortfolioConfig['profile']; username: string | null; onPlay: () => void }) {
  const external: { label: string; href: string | null; Icon: DockIcon; color: string }[] = [
    { label: 'GitHub', href: githubProfile(username), Icon: Github, color: 'ink' },
    { label: 'LinkedIn', href: externalUrl(profile.linkedinUrl), Icon: Linkedin, color: 'linkedin' },
    { label: 'E-Mail', href: emailUrl(profile.email), Icon: Mail, color: 'mail' },
  ]
  const available = external.filter((item) => item.href)
  return <nav className="dock" aria-label="Schnellnavigation" style={{ '--dock-items': 3 + available.length } as CSSProperties}>
    <a className="dock-item" href="#overview" aria-label="Übersicht"><span className="dock-tooltip">Übersicht</span><span className="dock-icon overview"><LayoutGrid size={23} strokeWidth={1.7}/></span><span className="dock-indicator"/></a>
    <a className="dock-item" href="#work" aria-label="Arbeit"><span className="dock-tooltip">Arbeit</span><span className="dock-icon work"><Layers3 size={24} strokeWidth={1.7}/></span></a>
    <button className="dock-item" onClick={onPlay} aria-label="Spielen: Boulder-Minispiel öffnen"><span className="dock-tooltip">Eine kleine Pause</span><span className="dock-icon play"><Gamepad2 size={25} strokeWidth={1.7}/></span></button>
    {available.length > 0 && <span className="dock-divider" aria-hidden="true"/>}
    {available.map(({ label, href, Icon, color }) => <a key={label} className="dock-item" href={href!} target={label === 'E-Mail' ? undefined : '_blank'} rel={label === 'E-Mail' ? undefined : 'noopener noreferrer'} aria-label={`${label} ${label === 'E-Mail' ? '(E-Mail-Programm öffnen)' : '(öffnet einen neuen Tab)'}`}>
      <span className="dock-tooltip">{label} ↗</span><span className={`dock-icon ${color}`}><Icon size={24} strokeWidth={1.7}/><ArrowUpRight className="dock-external" size={10}/></span>
    </a>)}
  </nav>
}
