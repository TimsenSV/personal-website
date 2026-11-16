import { useEffect, useState, type CSSProperties } from 'react'
import { GitMerge, GitPullRequest, GitPullRequestDraft } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** A finite, local vignette. These jokes never come from the GitHub activity API. */
export function PullRequestRollout({ requests }: { requests: PortfolioConfig['github']['playfulPullRequests'] }) {
  const [step, setStep] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const timers = requests.flatMap((_, index) => [
      window.setTimeout(() => setStep(index * 2 + 1), 1000 + index * 1600),
      window.setTimeout(() => setStep(index * 2 + 2), 2200 + index * 1600),
    ])
    return () => timers.forEach(window.clearTimeout)
  }, [requests, reducedMotion])

  return <ul className="pr-roll" aria-label="Pull Requests">
    {requests.map((pr, index) => {
      const status = reducedMotion || step > index * 2 + 1 ? 'merged' : step === index * 2 + 1 ? 'review' : 'draft'
      const Icon = status === 'merged' ? GitMerge : status === 'review' ? GitPullRequest : GitPullRequestDraft
      return <li key={pr.title} className={`pr-item is-${status}`} style={{ '--pr-order': index } as CSSProperties}>
        <Icon size={19} aria-hidden="true"/>
        <span className="pr-copy"><strong>{pr.title}</strong><small>{pr.tag}</small></span>
        <span key={status} className="pr-status">{status === 'merged' ? 'Merged' : status === 'review' ? 'Review' : 'Draft'}</span>
      </li>
    })}
  </ul>
}
