import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { calendarCells, fetchCalendar, parseCalendar } from '../services/contributions'
import { GitHubHeatmap } from '../components/GitHubHeatmap'
import { GithubWidget } from '../components/GithubWidget'
import { PullRequestRollout } from '../components/PullRequestRollout'
import { siteConfig } from '../content/site'
import { calendarFixture } from './fixtures/calendar'

describe('verified contribution snapshots', () => {
  it('accepts a matching complete calendar and rejects another profile', () => {
    expect(parseCalendar(calendarFixture(), 'timsensv').total).toBe(3)
    expect(() => parseCalendar(calendarFixture(), 'someone-else')).toThrow(/vollständiger/)
  })
  it('rejects invalid counts, levels, dates, gaps and totals', () => {
    for (const change of [
      (data: ReturnType<typeof calendarFixture>) => { data.days[10].count = -1 },
      (data: ReturnType<typeof calendarFixture>) => { data.days[10].level = 8 },
      (data: ReturnType<typeof calendarFixture>) => { data.days[10].date = '2026-02-30' },
      (data: ReturnType<typeof calendarFixture>) => { data.days[10].date = data.days[9].date },
      (data: ReturnType<typeof calendarFixture>) => { data.total = 42 },
    ]) {
      const data = calendarFixture(); change(data)
      expect(() => parseCalendar(data, 'TimsenSV')).toThrow()
    }
  })
  it('aligns weekdays in UTC and pads partial weeks without inventing days', () => {
    const days = [{ date: '2026-11-16', count: 1, level: 1 }, { date: '2026-11-17', count: 0, level: 0 }]
    expect(calendarCells(days)).toEqual([null, ...days, null, null, null, null])
    expect(calendarCells(calendarFixture().days, 26)).toHaveLength(182)
  })
  it('loads a same-origin snapshot without credentials and rejects missing files', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetch)
    await expect(fetchCalendar('TimsenSV', new AbortController().signal)).rejects.toThrow(/nicht verfügbar/)
    expect(fetch.mock.calls[0][0]).toBe('/data/github-contributions.json')
    expect(fetch.mock.calls[0][1].credentials).toBe('omit')
  })
  it('shows real counts after loading and handles a genuine all-zero calendar', async () => {
    const data = calendarFixture()
    data.days.forEach(day => { day.count = 0; day.level = 0 }); data.total = 0
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => data }))
    render(<GitHubHeatmap username="TimsenSV"/>)
    expect(screen.getByRole('status')).toHaveTextContent(/geladen/)
    expect(await screen.findByRole('img', { name: /^0 GitHub-Beiträge von TimsenSV/ })).toBeVisible()
    expect(screen.getByText('Hier war es öffentlich ruhig.')).toBeVisible()
  })
  it('recovers from a failed load without showing a fabricated heatmap', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ ok: true, json: async () => calendarFixture() }))
    render(<GitHubHeatmap username="TimsenSV"/>)
    await userEvent.click(await screen.findByRole('button', { name: 'Erneut laden' }))
    expect(await screen.findByRole('img', { name: /^3 GitHub-Beiträge/ })).toBeVisible()
  })
  it('includes the first and last day of the year in the widget, not just the latest half', async () => {
    render(<GithubWidget config={siteConfig.github} onOpen={() => {}}/>)
    const graph = await screen.findByRole('img', { name: /^3 GitHub-Beiträge/ })
    expect(graph).toHaveAccessibleName(/16\. November 2025 bis 15\. November 2026/)
    expect(graph.querySelectorAll('.heatmap-wide rect')).toHaveLength(365)
    expect(graph.querySelectorAll('.heatmap-stacked rect')).toHaveLength(365)
    expect(screen.getByText('Ein Jahr auf GitHub')).toBeVisible()
  })
  it('makes the fictional PRs available by hover, keyboard and explicit toggle', async () => {
    const user = userEvent.setup({ skipHover: true })
    render(<GithubWidget config={siteConfig.github} onOpen={() => {}}/>)
    const card = screen.getByRole('region', { name: 'Commit für Commit.' })
    const toggle = screen.getByRole('button', { name: 'Pull Requests anzeigen' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.hover(card)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    await user.unhover(card)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.tab({ shift: true })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    await user.click(document.body)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
  it('moves each PR from draft through review to merged in order, and replays on reopening', () => {
    vi.useFakeTimers()
    try {
      render(<GithubWidget config={siteConfig.github} onOpen={() => {}}/>)
      const toggle = screen.getByRole('button', { name: 'Pull Requests anzeigen' })
      fireEvent.click(toggle)
      const statuses = () => screen.getAllByRole('listitem').map(item => item.querySelector('.pr-status')?.textContent)
      expect(statuses()).toEqual(['Draft', 'Draft', 'Draft'])
      act(() => vi.advanceTimersByTime(1000))
      expect(statuses()).toEqual(['Review', 'Draft', 'Draft'])
      act(() => vi.advanceTimersByTime(1200))
      expect(statuses()).toEqual(['Merged', 'Draft', 'Draft'])
      act(() => vi.advanceTimersByTime(400))
      expect(statuses()).toEqual(['Merged', 'Review', 'Draft'])
      act(() => vi.advanceTimersByTime(1200))
      expect(statuses()).toEqual(['Merged', 'Merged', 'Draft'])
      act(() => vi.advanceTimersByTime(400))
      expect(statuses()).toEqual(['Merged', 'Merged', 'Review'])
      act(() => vi.advanceTimersByTime(1200))
      expect(statuses()).toEqual(['Merged', 'Merged', 'Merged'])
      fireEvent.click(toggle)
      fireEvent.click(toggle)
      expect(statuses()).toEqual(['Draft', 'Draft', 'Draft'])
      fireEvent.click(toggle)
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    } finally { vi.useRealTimers() }
  })
  it('shows a still end state with reduced motion and cancels pending sequence timers on close', () => {
    vi.useFakeTimers()
    try {
      vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
      const reduced = render(<PullRequestRollout requests={siteConfig.github.playfulPullRequests}/>)
      expect(screen.getAllByText('Merged')).toHaveLength(3)
      expect(vi.getTimerCount()).toBe(0)
      reduced.unmount()
      vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
      const animated = render(<PullRequestRollout requests={siteConfig.github.playfulPullRequests}/>)
      expect(vi.getTimerCount()).toBe(6)
      animated.unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally { vi.useRealTimers() }
  })
})
