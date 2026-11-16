import { useState, type CSSProperties } from 'react'
import { ArrowUpRight, ChevronDown, Code2, GitBranch, Github, GitPullRequest } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { githubProfile } from '../lib/links'
import { ExternalLink } from './ExternalLink'
import { GitHubHeatmap } from './GitHubHeatmap'
import { Popout } from './Popout'

export function GithubWidget({ config, onOpen }: { config: PortfolioConfig['github']; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const show = hovered || focused || pinned
  const selected = config.repositories[0]
  return <section className="card github-card heatmap-card" aria-labelledby="github-title"
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true) }} onPointerLeave={() => setHovered(false)}
    onFocus={event => { if (event.target.matches(':focus-visible') && !event.target.closest('.pr-toggle')) setFocused(true) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="widget-top"><span className="eyebrow"><Github size={16}/> GitHub</span><ExternalLink href={githubProfile(config.username)}>@{config.username}</ExternalLink><button className="round-link" onClick={onOpen} aria-label="GitHub und Experimente öffnen"><ArrowUpRight size={18}/></button></div>
    <h2 className="sr-only" id="github-title">Commit für Commit.</h2>
    <GitHubHeatmap username={config.username}/>
    <div className={`playful-prs ${show ? 'is-revealed' : ''}`}>
      <button className="pr-toggle" aria-expanded={show} aria-controls="playful-pull-requests" onClick={() => { setPinned(!show); setHovered(false); setFocused(false) }}><span>KI-Gedankenspiele <small>Fiktive PRs</small></span><ChevronDown size={15}/></button>
      <div className="pr-roll-area"><p className="pr-invitation" aria-hidden={show}>Ein paar Ideen warten<br/>noch auf ihr Review. <span>Hover oder antippen ↗</span></p>
        <ul id="playful-pull-requests" className="pr-roll" aria-hidden={!show}>{config.playfulPullRequests.map((pr, index) => <li key={pr.title} style={{ '--pr-order': index } as CSSProperties}><GitPullRequest size={16}/><span><strong>{pr.title}</strong><small>{pr.tag}</small></span><span className="pr-draft">draft</span></li>)}</ul>
      </div>
    </div>
    <div className="github-repo-footer"><Popout label="Repository-Vorschau öffnen" title="Auf der Werkbank" buttonClassName="repo-chip" action={{ label: 'Mehr aus der Werkbank', onClick: onOpen }} trigger={<><GitBranch size={14}/><span>{selected?.name ?? 'Nächstes Experiment'}</span><ArrowUpRight size={13}/></>}>
      <div className="popout-icon"><Code2 size={24}/></div><h3>{selected?.name ?? 'Raum für die nächste Idee'}</h3><p>{selected?.description ?? 'Mein nächstes Experiment bekommt hier seinen Platz.'}</p>{selected && <div className="tag-row">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}{!selected?.url && <span className="small-note">Dieses Portfolio liegt noch lokal.</span>}
    </Popout></div>
  </section>
}
