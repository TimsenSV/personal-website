import { useEffect, useState, type CSSProperties } from 'react'
import { GitMerge, GitPullRequest, GitPullRequestDraft } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Phase = 'draft' | 'review' | 'merged' | 'leaving'
const phases: Record<Phase, { duration: number; next: Phase }> = {
  draft: { duration: 1000, next: 'review' },
  review: { duration: 1200, next: 'merged' },
  merged: { duration: 1000, next: 'leaving' },
  leaving: { duration: 360, next: 'draft' },
}

/** A local, three-slot queue. These jokes never come from the GitHub activity API. */
export function PullRequestRollout({ requests }: { requests: PortfolioConfig['github']['playfulPullRequests'] }) {
  const [{ head, phase }, setQueue] = useState<{ head: number; phase: Phase }>({ head: 0, phase: 'draft' })
  const reducedMotion = useReducedMotion()
  const visibleCount = Math.min(3, requests.length)

  useEffect(() => {
    if (reducedMotion || !visibleCount) return
    let timer: number | undefined
    const schedule = () => {
      window.clearTimeout(timer)
      if (document.visibilityState === 'hidden') return
      timer = window.setTimeout(() => setQueue(current => ({
        head: current.head + (current.phase === 'leaving' ? 1 : 0),
        phase: phases[current.phase].next,
      })), phases[phase].duration)
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => { window.clearTimeout(timer); document.removeEventListener('visibilitychange', schedule) }
  }, [phase, reducedMotion, visibleCount])

  if (!visibleCount) return null
  return <ul className={`pr-roll pr-phase-${reducedMotion ? 'still' : phase}`} aria-label="Pull Requests" style={{ '--pr-visible': visibleCount } as CSSProperties}>
    {Array.from({ length: visibleCount }, (_, index) => {
      const sequence = head + index
      const pr = requests[sequence % requests.length]
      const status = reducedMotion ? 'merged' : index > 0 ? 'draft' : phase === 'leaving' ? 'merged' : phase
      const Icon = status === 'merged' ? GitMerge : status === 'review' ? GitPullRequest : GitPullRequestDraft
      return <li key={sequence} className="pr-slot" style={{ '--pr-order': index } as CSSProperties}>
        <div className={`pr-item is-${status}`}>
          <Icon size={19} aria-hidden="true"/>
          <span className="pr-copy"><strong>{pr.title}</strong><small>{pr.tag}</small></span>
          <span key={status} className="pr-status">{status === 'merged' ? 'Merged' : status === 'review' ? 'Review' : 'Draft'}</span>
        </div>
      </li>
    })}
  </ul>
}
