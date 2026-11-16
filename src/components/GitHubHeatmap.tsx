import { useState } from 'react'
import { useContributionCalendar } from '../hooks/useContributionCalendar'
import { calendarCells, type ContributionDay } from '../services/contributions'

const shortDate = (date: string) => new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(date))
const fullDate = (date: string) => new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
const fills = ['#e8edf7', '#b3c6ff', '#7c9ef5', '#426ee8', '#2548b7']

function CalendarGrid({ cells }: { cells: (ContributionDay | null)[] }) {
  const columns = cells.length / 7
  const months = cells.flatMap((day, index) => day && index % 7 === 0 && (index === 0 || new Date(`${day.date}T00:00:00Z`).getUTCDate() <= 7) ? [{ index: index / 7, label: new Intl.DateTimeFormat('de-DE', { month: 'short', timeZone: 'UTC' }).format(new Date(day.date)) }] : [])
  return <svg className="heatmap-svg" viewBox={`0 0 ${columns * 13} 107`} aria-hidden="true">
    {months.map(month => <text key={month.index} x={month.index * 13} y="9" className="heatmap-month">{month.label}</text>)}
    {cells.map((day, index) => day && <rect key={day.date} x={Math.floor(index / 7) * 13} y={20 + index % 7 * 12.5} width="9" height="9" rx="2" fill={fills[day.level]}><title>{fullDate(day.date)}: {day.count} {day.count === 1 ? 'Beitrag' : 'Beiträge'}</title></rect>)}
  </svg>
}

export function GitHubHeatmap({ username, full = false }: { username: string | null; full?: boolean }) {
  const [now] = useState(Date.now)
  const { state, retry } = useContributionCalendar(username)
  if (state.status !== 'ready') return <div className="contribution-empty" role="status">
    <div className="heatmap-placeholder" aria-hidden="true">{Array.from({ length: 104 }, (_, i) => <i key={i}/>)}</div>
    <p>{state.status === 'idle' ? 'Dein GitHub-Kalender bekommt hier seinen Platz.' : state.status === 'loading' ? 'GitHub-Kalender wird geladen …' : state.message}</p>
    {state.status === 'error' && <button className="text-button" onClick={retry}>Erneut laden</button>}
  </div>
  const { calendar } = state
  const cells = calendarCells(calendar.days)
  const days = cells.filter(day => day !== null)
  const count = days.reduce((sum, day) => sum + day.count, 0)
  const split = Math.ceil(cells.length / 14) * 7
  const summary = `${count.toLocaleString('de-DE')} GitHub-Beiträge von ${username}, ${fullDate(days[0].date)} bis ${fullDate(days.at(-1)!.date)}.`
  const stale = now - Date.parse(calendar.fetchedAt) > 7 * 86400000
  return <figure className={`contribution-calendar ${full ? 'is-full' : ''}`}>
    <div className="heatmap-heading"><span>Ein Jahr auf GitHub</span><strong>{count.toLocaleString('de-DE')} Beiträge</strong></div>
    <div className="heatmap-year" role="img" aria-label={summary}>
      <div className="heatmap-wide"><CalendarGrid cells={cells}/></div>
      <div className="heatmap-stacked"><CalendarGrid cells={cells.slice(0, split)}/><div style={{ width: `${(cells.length - split) / split * 100}%` }}><CalendarGrid cells={cells.slice(split)}/></div></div>
    </div>
    <figcaption className="heatmap-caption"><span>{count === 0 ? 'Hier war es öffentlich ruhig.' : `${shortDate(days[0].date)}${days[0].date.slice(0, 4)} — ${shortDate(days.at(-1)!.date)}${days.at(-1)!.date.slice(0, 4)}`}</span><span className="heatmap-legend" aria-label="Hell bedeutet wenige, dunkel viele Beiträge.">Weniger {fills.map(fill => <i key={fill} style={{ background: fill }}/>) } Mehr</span></figcaption>
    {stale && <p className="heatmap-updated">Gespeicherter Stand: {fullDate(calendar.fetchedAt)}</p>}
    {full && calendar.anonymousContributions > 0 && <p className="small-note">Enthält auch anonym gezählte private Beiträge, wie im GitHub-Kalender. Repository-Namen und Inhalte werden dafür nicht gespeichert.</p>}
  </figure>
}
