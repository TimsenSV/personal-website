import { githubProfile } from '../lib/links'

export type GitHubActivity = { id: string; label: string; repository: string; url: string; date: string }
type PublicEvent = { id: string; type: string; repo: { name: string }; created_at: string }
const eventLabels: Record<string, string> = {
  PushEvent: 'Code weiterentwickelt',
  PullRequestEvent: 'An einem Pull Request gearbeitet',
  IssuesEvent: 'An einem Issue gearbeitet',
  CreateEvent: 'Etwas Neues angelegt',
  ReleaseEvent: 'Eine Version veröffentlicht',
  ForkEvent: 'Ein Repository geforkt',
  WatchEvent: 'Ein Repository entdeckt',
  IssueCommentEvent: 'Eine Diskussion weitergeführt',
  PullRequestReviewEvent: 'Code reviewed',
}

export async function fetchGitHubActivity(username: string, signal: AbortSignal): Promise<GitHubActivity[]> {
  if (!githubProfile(username)) throw new Error('Der GitHub-Nutzername ist nicht gültig.')
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`, {
    signal,
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10' },
  })
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) throw new Error('GitHub macht gerade eine Pause. Bitte später noch einmal versuchen.')
    if (response.status === 404) throw new Error('Dieses GitHub-Profil wurde nicht gefunden.')
    throw new Error('Die GitHub-Aktivität ist gerade nicht erreichbar.')
  }
  const events: unknown = await response.json()
  if (!Array.isArray(events)) throw new Error('GitHub hat keine lesbare Aktivität zurückgegeben.')
  return events.filter((event): event is PublicEvent =>
    event && typeof event.id === 'string' && typeof event.type === 'string'
    && typeof event.repo?.name === 'string' && /^[\w.-]+\/[\w.-]+$/.test(event.repo.name)
    && typeof event.created_at === 'string' && !Number.isNaN(Date.parse(event.created_at)),
  ).slice(0, 3).map((event) => ({
    id: event.id,
    label: eventLabels[event.type] ?? 'Öffentliche Aktivität',
    repository: event.repo.name,
    url: `https://github.com/${event.repo.name}`,
    date: event.created_at,
  }))
}
