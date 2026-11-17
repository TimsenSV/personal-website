import { useEffect, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { githubProfile } from '../lib/links'
import { ExternalLink } from './ExternalLink'
import { GitHubHeatmap } from './GitHubHeatmap'
import { PullRequestRollout } from './PullRequestRollout'

export function GithubWidget({ config, onOpen }: { config: PortfolioConfig['github']; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false)
  const show = config.playfulPullRequests.length > 0 && (hovered || focused || pinned)
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
    onFocus={event => { if (event.target.matches(':focus-visible') && !event.target.closest('.heatmap-trigger')) setFocused(true) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="widget-top"><ExternalLink href={githubProfile(config.username)}><Github size={19} aria-hidden="true"/>@{config.username}</ExternalLink><button className="round-link" onClick={onOpen} aria-label="Open GitHub and experiments"><ArrowUpRight size={18}/></button></div>
    <h2 className="sr-only" id="github-title">Commit by commit.</h2>
    <GitHubHeatmap username={config.username} interaction={config.playfulPullRequests.length ? { expanded: show, controls: 'playful-pull-requests', onToggle: () => { setPinned(!pinned); setHovered(false); setFocused(false) } } : undefined}/>
    <div id="playful-pull-requests" className="pr-rollout" hidden={!show}>{show && <PullRequestRollout requests={config.playfulPullRequests}/>}</div>
  </section>
}
