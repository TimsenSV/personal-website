import { useState } from 'react'
import { useContributionCalendar } from '../hooks/useContributionCalendar'
import { calendarCells, type ContributionDay } from '../services/contributions'

const shortDate = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
const fullDate = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
const fills = ['#e8edf7', '#b3c6ff', '#7c9ef5', '#426ee8', '#2548b7']

function CalendarGrid({ cells }: { cells: (ContributionDay | null)[] }) {
  const columns = cells.length / 7
  const months = cells.flatMap((day, index) => day && index % 7 === 0 && (index === 0 || new Date(`${day.date}T00:00:00Z`).getUTCDate() <= 7) ? [{ index: index / 7, label: new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(new Date(day.date)) }] : [])
  return <svg className="heatmap-svg" viewBox={`0 0 ${columns * 13} 107`} aria-hidden="true">
    {months.map(month => <text key={month.index} x={month.index * 13} y="9" className="heatmap-month">{month.label}</text>)}
    {cells.map((day, index) => day && <rect key={day.date} x={Math.floor(index / 7) * 13} y={20 + index % 7 * 12.5} width="9" height="9" rx="2" fill={fills[day.level]}><title>{fullDate(day.date)}: {day.count} {day.count === 1 ? 'contribution' : 'contributions'}</title></rect>)}
  </svg>
}

type HeatmapInteraction = { expanded: boolean; controls: string; onToggle: () => void }

export function GitHubHeatmap({ username, full = false, interaction }: { username: string | null; full?: boolean; interaction?: HeatmapInteraction }) {
  const [now] = useState(Date.now)
  const { state, retry } = useContributionCalendar(username)
  if (state.status !== 'ready') return <div className="contribution-empty" role="status">
    <div className="heatmap-placeholder" aria-hidden="true">{Array.from({ length: 104 }, (_, i) => <i key={i}/>)}</div>
    <p>{state.status === 'idle' ? 'Your GitHub calendar will live here.' : state.status === 'loading' ? 'Loading GitHub calendar …' : state.message}</p>
    {state.status === 'error' && <button className="text-button" onClick={retry}>Reload</button>}
  </div>
  const { calendar } = state
  const cells = calendarCells(calendar.days)
  const days = cells.filter(day => day !== null)
  const count = days.reduce((sum, day) => sum + day.count, 0)
  const split = Math.ceil(cells.length / 14) * 7
  const summary = `${count.toLocaleString('en-GB')} GitHub contributions by ${username}, ${fullDate(days[0].date)} to ${fullDate(days.at(-1)!.date)}.`
  const stale = now - Date.parse(calendar.fetchedAt) > 7 * 86400000
  const plot = <span className="heatmap-year-image" role="img" aria-label={summary}>
    <span className="heatmap-wide"><CalendarGrid cells={cells}/></span>
    <span className="heatmap-stacked"><CalendarGrid cells={cells.slice(0, split)}/><span style={{ width: `${(cells.length - split) / split * 100}%` }}><CalendarGrid cells={cells.slice(split)}/></span></span>
  </span>
  return <figure className={`contribution-calendar ${full ? 'is-full' : ''}`}>
    <div className="heatmap-heading"><span>A year on GitHub</span><strong>{count.toLocaleString('en-GB')} contributions</strong></div>
    {interaction ? <button className="heatmap-year heatmap-trigger" aria-label="Show pull requests" aria-expanded={interaction.expanded} aria-controls={interaction.controls} onClick={interaction.onToggle}>{plot}</button> : <div className="heatmap-year">{plot}</div>}
    <figcaption className="heatmap-caption"><span>{count === 0 ? 'Quiet on the public side.' : `${shortDate(days[0].date)} — ${shortDate(days.at(-1)!.date)}`}</span><span className="heatmap-legend" aria-label="Lighter means fewer contributions, darker means more.">Less {fills.map(fill => <i key={fill} style={{ background: fill }}/>) } More</span></figcaption>
    {stale && <p className="heatmap-updated">Snapshot updated: {fullDate(calendar.fetchedAt)}</p>}
    {full && calendar.anonymousContributions > 0 && <p className="small-note">Includes anonymous private contribution counts, as shown on GitHub. No private repository names or contents are stored.</p>}
  </figure>
}
