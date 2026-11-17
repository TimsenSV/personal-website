import { githubProfile } from '../lib/links'

export type GitHubActivity = { id: string; label: string; repository: string; url: string; date: string }
type PublicEvent = { id: string; type: string; repo: { name: string }; created_at: string }
const eventLabels: Record<string, string> = {
  PushEvent: 'Pushed code',
  PullRequestEvent: 'Worked on a pull request',
  IssuesEvent: 'Worked on an issue',
  CreateEvent: 'Created something new',
  ReleaseEvent: 'Published a release',
  ForkEvent: 'Forked a repository',
  WatchEvent: 'Discovered a repository',
  IssueCommentEvent: 'Joined a discussion',
  PullRequestReviewEvent: 'Code reviewed',
}

export async function fetchGitHubActivity(username: string, signal: AbortSignal): Promise<GitHubActivity[]> {
  if (!githubProfile(username)) throw new Error('That GitHub username isn’t valid.')
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`, {
    signal,
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10' },
  })
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) throw new Error('GitHub is taking a breather. Please try again later.')
    if (response.status === 404) throw new Error('This GitHub profile wasn’t found.')
    throw new Error('GitHub activity is currently unavailable.')
  }
  const events: unknown = await response.json()
  if (!Array.isArray(events)) throw new Error('GitHub returned unreadable activity data.')
  return events.filter((event): event is PublicEvent =>
    event && typeof event.id === 'string' && typeof event.type === 'string'
    && typeof event.repo?.name === 'string' && /^[\w.-]+\/[\w.-]+$/.test(event.repo.name)
    && typeof event.created_at === 'string' && !Number.isNaN(Date.parse(event.created_at)),
  ).slice(0, 3).map((event) => ({
    id: event.id,
    label: eventLabels[event.type] ?? 'Public activity',
    repository: event.repo.name,
    url: `https://github.com/${event.repo.name}`,
    date: event.created_at,
  }))
}
