import { assetUrl, githubProfile } from '../lib/links'

export type ContributionDay = { date: string; count: number; level: number }
export type ContributionCalendar = {
  version: 1; username: string; fetchedAt: string; source: string
  total: number; anonymousContributions: number; days: ContributionDay[]
}

export function parseCalendar(value: unknown, username: string): ContributionCalendar {
  if (!value || typeof value !== 'object') throw new Error('The GitHub calendar couldn’t be read.')
  const data = value as Partial<ContributionCalendar>
  if (data.version !== 1 || data.username?.toLowerCase() !== username.toLowerCase()
    || typeof data.fetchedAt !== 'string' || Number.isNaN(Date.parse(data.fetchedAt))
    || !Number.isInteger(data.total) || data.total! < 0 || !Number.isInteger(data.anonymousContributions)
    || data.anonymousContributions! < 0 || data.anonymousContributions! > data.total!
    || !Array.isArray(data.days) || data.days.length < 350 || data.days.length > 371) {
    throw new Error('There’s no complete GitHub calendar for this profile yet.')
  }
  const days = data.days
  if (days.some((day, index) => !day || typeof day.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)
    || !Number.isFinite(Date.parse(day.date)) || new Date(day.date).toISOString().slice(0, 10) !== day.date
    || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4
    || (day.count === 0) !== (day.level === 0)
    || (index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== 86400000))
    || days.reduce((sum, day) => sum + day.count, 0) !== data.total) {
    throw new Error('The GitHub calendar contains incomplete daily data.')
  }
  return { ...data, source: 'GitHub GraphQL API' } as ContributionCalendar
}

export async function fetchCalendar(username: string, signal: AbortSignal): Promise<ContributionCalendar> {
  if (!githubProfile(username)) throw new Error('Please add a GitHub profile first.')
  const response = await fetch(assetUrl('data/github-contributions.json'), { signal, credentials: 'omit' })
  if (!response.ok) throw new Error('The GitHub calendar is currently unavailable.')
  return parseCalendar(await response.json(), username)
}

export function calendarCells(days: ContributionDay[], weeks?: number): (ContributionDay | null)[] {
  if (!days.length) return []
  const cells: (ContributionDay | null)[] = [...Array<null>(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null), ...days]
  while (cells.length % 7) cells.push(null)
  return weeks ? cells.slice(-weeks * 7) : cells
}
