import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GithubDetail } from '../components/Widgets'
import { calendarFixture } from './fixtures/calendar'
import { fetchGitHubActivity } from '../services/github'

const exampleEvent = { id: '1', type: 'PushEvent', repo: { name: 'octocat/Hello-World' }, created_at: '2026-11-15T12:00:00Z' }

describe('GitHub data and independent fallback states', () => {
  it('makes no request without a configured username', () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    render(<GithubDetail config={{ username: null, repositories: [], playfulPullRequests: [] }}/>)
    expect(screen.getByText(/No GitHub profile connected/)).toBeVisible()
    expect(fetch).not.toHaveBeenCalled()
  })
  it('shows loading, then real contextual activity', async () => {
    const fetch = vi.fn(async (url: string) => ({ ok: true, json: async () => url.includes('github-contributions.json') ? calendarFixture('octocat') : [exampleEvent] }))
    vi.stubGlobal('fetch', fetch)
    render(<GithubDetail config={{ username: 'octocat', repositories: [], playfulPullRequests: [] }}/>)
    expect(screen.getByText(/Loading activity from GitHub/)).toBeVisible()
    expect(await screen.findByText('Pushed code')).toBeVisible()
    expect(screen.getByRole('link', { name: /octocat\/Hello-World/ })).toHaveAttribute('href', 'https://github.com/octocat/Hello-World')
    expect(JSON.stringify(fetch.mock.calls)).not.toContain('Authorization')
  })
  it('shows a genuine empty state for an empty activity response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<GithubDetail config={{ username: 'octocat', repositories: [], playfulPullRequests: [] }}/>)
    expect(await screen.findByText(/No public activity/)).toBeVisible()
  })
  it('recovers from rate limiting through an explicit retry', async () => {
    let activityCalls = 0
    const fetch = vi.fn(async (url: string) => url.includes('github-contributions.json') ? { ok: true, json: async () => calendarFixture('octocat') } : ++activityCalls === 1 ? { ok: false, status: 403 } : { ok: true, json: async () => [exampleEvent] })
    vi.stubGlobal('fetch', fetch)
    render(<GithubDetail config={{ username: 'octocat', repositories: [], playfulPullRequests: [] }}/>)
    expect(await screen.findByText(/GitHub is taking a breather/)).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(screen.getByText('Pushed code')).toBeVisible())
  })
  it('filters malformed activity and rejects invalid users before fetching', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ ...exampleEvent, repo: { name: 'javascript:alert(1)' } }, { ...exampleEvent, created_at: 'invalid' }, exampleEvent] })
    vi.stubGlobal('fetch', fetch)
    const events = await fetchGitHubActivity('octocat', new AbortController().signal)
    expect(events).toHaveLength(1)
    await expect(fetchGitHubActivity('../other', new AbortController().signal)).rejects.toThrow(/isn’t valid/)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
