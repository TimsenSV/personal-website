import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GithubDetail } from '../components/Widgets'
import { fetchGitHubActivity } from '../services/github'

const exampleEvent = { id: '1', type: 'PushEvent', repo: { name: 'octocat/Hello-World' }, created_at: '2026-11-15T12:00:00Z' }

describe('GitHub data and independent fallback states', () => {
  it('makes no request without a configured username', () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    render(<GithubDetail config={{ username: null, repositories: [] }}/>)
    expect(screen.getByText(/noch kein GitHub-Profil verbunden/)).toBeVisible()
    expect(fetch).not.toHaveBeenCalled()
  })
  it('shows loading, then real contextual activity', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [exampleEvent] })
    vi.stubGlobal('fetch', fetch)
    render(<GithubDetail config={{ username: 'octocat', repositories: [] }}/>)
    expect(screen.getByRole('status')).toHaveTextContent(/wird von GitHub geladen/)
    expect(await screen.findByText('Code weiterentwickelt')).toBeVisible()
    expect(screen.getByRole('link', { name: /octocat\/Hello-World/ })).toHaveAttribute('href', 'https://github.com/octocat/Hello-World')
    expect(fetch.mock.calls[0][1].headers).not.toHaveProperty('Authorization')
  })
  it('shows a genuine empty state for an empty activity response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<GithubDetail config={{ username: 'octocat', repositories: [] }}/>)
    expect(await screen.findByText(/keine öffentlichen Aktivitäten sichtbar/)).toBeVisible()
  })
  it('recovers from rate limiting through an explicit retry', async () => {
    const fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 403 }).mockResolvedValueOnce({ ok: true, json: async () => [exampleEvent] })
    vi.stubGlobal('fetch', fetch)
    render(<GithubDetail config={{ username: 'octocat', repositories: [] }}/>)
    expect(await screen.findByText(/GitHub macht gerade eine Pause/)).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Erneut versuchen' }))
    await waitFor(() => expect(screen.getByText('Code weiterentwickelt')).toBeVisible())
  })
  it('filters malformed activity and rejects invalid users before fetching', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ ...exampleEvent, repo: { name: 'javascript:alert(1)' } }, { ...exampleEvent, created_at: 'invalid' }, exampleEvent] })
    vi.stubGlobal('fetch', fetch)
    const events = await fetchGitHubActivity('octocat', new AbortController().signal)
    expect(events).toHaveLength(1)
    await expect(fetchGitHubActivity('../other', new AbortController().signal)).rejects.toThrow(/nicht gültig/)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
