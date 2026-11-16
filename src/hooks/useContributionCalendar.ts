import { useEffect, useState } from 'react'
import { fetchCalendar, type ContributionCalendar } from '../services/contributions'

type CalendarState = { status: 'loading' } | { status: 'idle' } | { status: 'ready'; calendar: ContributionCalendar } | { status: 'error'; message: string }
export function useContributionCalendar(username: string | null) {
  const [result, setResult] = useState<{ username: string | null; state: CalendarState }>({ username: null, state: { status: 'idle' } })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!username) return
    const controller = new AbortController()
    let cancelled = false
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    fetchCalendar(username, controller.signal).then(calendar => {
      if (!cancelled) setResult({ username, state: { status: 'ready', calendar } })
    }).catch((error: unknown) => {
      if (!cancelled) setResult({ username, state: { status: 'error', message: controller.signal.aborted ? 'Der Kalender braucht gerade eine Pause.' : error instanceof Error ? error.message : 'Der Kalender ist gerade nicht verfügbar.' } })
    }).finally(() => window.clearTimeout(timeout))
    return () => { cancelled = true; controller.abort(); window.clearTimeout(timeout) }
  }, [username, attempt])
  const state: CalendarState = !username ? { status: 'idle' } : result.username !== username ? { status: 'loading' } : result.state
  return { state, retry: () => { setResult({ username, state: { status: 'loading' } }); setAttempt(value => value + 1) } }
}
