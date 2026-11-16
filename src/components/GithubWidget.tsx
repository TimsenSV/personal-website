import { useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, Code2, GitBranch, Github, GitPullRequest } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { githubProfile } from '../lib/links'
import { ExternalLink } from './ExternalLink'
import { GitHubHeatmap } from './GitHubHeatmap'
import { Popout } from './Popout'
import { PullRequestRollout } from './PullRequestRollout'

export function GithubWidget({ config, onOpen }: { config: PortfolioConfig['github']; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const show = config.playfulPullRequests.length > 0 && (hovered || focused || pinned)
  const selected = config.repositories[0]
  useEffect(() => {
    if (!show) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setPinned(false); setHovered(false); setFocused(false) }
    }
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('.heatmap-card')) { setPinned(false); setFocused(false) }
    }
    document.addEventListener('keydown', dismiss)
    document.addEventListener('pointerdown', dismissOutside)
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', dismissOutside) }
  }, [show])
  return <section className={`card github-card heatmap-card ${show ? 'prs-open' : ''}`} aria-labelledby="github-title"
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true) }} onPointerLeave={() => setHovered(false)}
    onFocus={event => { if (event.target.matches(':focus-visible') && !event.target.closest('.pr-toggle')) setFocused(true) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="widget-top"><span className="eyebrow"><Github size={16}/> GitHub</span><ExternalLink href={githubProfile(config.username)}>@{config.username}</ExternalLink><button className="round-link" onClick={onOpen} aria-label="GitHub und Experimente öffnen"><ArrowUpRight size={18}/></button></div>
    <h2 className="sr-only" id="github-title">Commit für Commit.</h2>
    <GitHubHeatmap username={config.username}/>
    <div className="github-repo-footer"><Popout label="Repository-Vorschau öffnen" title="Auf der Werkbank" buttonClassName="repo-chip" action={{ label: 'Mehr aus der Werkbank', onClick: onOpen }} trigger={<><GitBranch size={14}/><span>{selected?.name ?? 'Nächstes Experiment'}</span><ArrowUpRight size={13}/></>}>
      <div className="popout-icon"><Code2 size={24}/></div><h3>{selected?.name ?? 'Raum für die nächste Idee'}</h3><p>{selected?.description ?? 'Mein nächstes Experiment bekommt hier seinen Platz.'}</p>{selected && <div className="tag-row">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}{!selected?.url && <span className="small-note">Dieses Portfolio liegt noch lokal.</span>}
    </Popout>{config.playfulPullRequests.length > 0 && <button className="pr-toggle" aria-label="Pull Requests anzeigen" aria-expanded={show} aria-controls="playful-pull-requests" onClick={() => { setPinned(!show); setHovered(false); setFocused(false) }}><GitPullRequest size={17}/><span>{config.playfulPullRequests.length}</span><ChevronDown size={13}/></button>}</div>
    <div id="playful-pull-requests" className="pr-rollout" hidden={!show}>{show && <PullRequestRollout requests={config.playfulPullRequests}/>}</div>
  </section>
}
