import { useEffect, useState } from 'react'
import { fetchGitHubActivity } from '../services/github'
import type { GitHubActivity } from '../services/github'

export type ActivityState =
  | { status: 'idle' | 'loading' | 'empty'; activities?: never; message?: never }
  | { status: 'success'; activities: GitHubActivity[]; message?: never }
  | { status: 'error'; message: string; activities?: never }

export function useGitHubActivity(username: string | null) {
  const [result, setResult] = useState<{ username: string | null; state: ActivityState }>({ username: null, state: { status: 'idle' } })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!username) return
    const controller = new AbortController()
    let cancelled = false
    const timeout = window.setTimeout(() => controller.abort(), 10_000)
    fetchGitHubActivity(username, controller.signal).then((activities) => {
      if (!cancelled) setResult({ username, state: activities.length ? { status: 'success', activities } : { status: 'empty' } })
    }).catch((error: unknown) => {
      if (!cancelled) setResult({ username, state: { status: 'error', message: controller.signal.aborted ? 'GitHub antwortet gerade nicht. Versuche es später erneut.' : error instanceof Error ? error.message : 'Die Aktivität ist gerade nicht erreichbar.' } })
    }).finally(() => window.clearTimeout(timeout))
    return () => { cancelled = true; controller.abort(); window.clearTimeout(timeout) }
  }, [username, attempt])
  const state: ActivityState = !username ? { status: 'idle' } : result.username !== username ? { status: 'loading' } : result.state
  return {
    state,
    retry: () => { setResult({ username, state: { status: 'loading' } }); setAttempt((value) => value + 1) },
  }
}
