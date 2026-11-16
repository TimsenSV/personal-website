import { useState } from 'react'
import { useContributionCalendar } from '../hooks/useContributionCalendar'
import { calendarCells } from '../services/contributions'

const shortDate = (date: string) => new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(date))
const fullDate = (date: string) => new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
const fills = ['#e8edf7', '#b3c6ff', '#7c9ef5', '#426ee8', '#2548b7']

export function GitHubHeatmap({ username, full = false }: { username: string | null; full?: boolean }) {
  const [now] = useState(Date.now)
  const { state, retry } = useContributionCalendar(username)
  if (state.status !== 'ready') return <div className="contribution-empty" role="status">
    <div className="heatmap-placeholder" aria-hidden="true">{Array.from({ length: 104 }, (_, i) => <i key={i}/>)}</div>
    <p>{state.status === 'idle' ? 'Dein GitHub-Kalender bekommt hier seinen Platz.' : state.status === 'loading' ? 'GitHub-Kalender wird geladen …' : state.message}</p>
    {state.status === 'error' && <button className="text-button" onClick={retry}>Erneut laden</button>}
  </div>
  const { calendar } = state
  const cells = calendarCells(calendar.days, full ? undefined : 26)
  const days = cells.filter(day => day !== null)
  const count = days.reduce((sum, day) => sum + day.count, 0)
  const columns = cells.length / 7
  const months = cells.flatMap((day, index) => day && new Date(`${day.date}T00:00:00Z`).getUTCDate() <= 7 && index % 7 === 0 ? [{ index: index / 7, label: new Intl.DateTimeFormat('de-DE', { month: 'short', timeZone: 'UTC' }).format(new Date(day.date)) }] : [])
  const summary = `${count.toLocaleString('de-DE')} GitHub-Beiträge von ${username}, ${fullDate(days[0].date)} bis ${fullDate(days.at(-1)!.date)}.`
  const stale = now - Date.parse(calendar.fetchedAt) > 7 * 86400000
  return <figure className={`contribution-calendar ${full ? 'is-full' : ''}`}>
    <div className="heatmap-heading"><span>{full ? 'Ein Jahr auf GitHub' : 'Letzte 26 Wochen'}</span><strong>{count.toLocaleString('de-DE')} Beiträge</strong></div>
    <svg className="heatmap-svg" viewBox={`0 0 ${columns * 13} 91`} role="img" aria-label={summary}>
      {months.map(month => <text key={month.index} x={month.index * 13} y="8" className="heatmap-month">{month.label}</text>)}
      {cells.map((day, index) => day && <rect key={day.date} x={Math.floor(index / 7) * 13} y={17 + index % 7 * 10.5} width="8" height="8" rx="2" fill={fills[day.level]}><title>{fullDate(day.date)}: {day.count} {day.count === 1 ? 'Beitrag' : 'Beiträge'}</title></rect>)}
    </svg>
    <figcaption className="heatmap-caption"><span>{count === 0 ? 'Hier war es öffentlich ruhig.' : 'Viele kleine Schritte.'}</span><span className="heatmap-legend" aria-label="Hell bedeutet wenige, dunkel viele Beiträge.">Weniger {fills.map(fill => <i key={fill} style={{ background: fill }}/>) } Mehr</span></figcaption>
    <p className="heatmap-updated">{stale ? 'Gespeicherter Stand' : 'Stand'} {shortDate(calendar.fetchedAt)} · GitHub{full && ` · ${calendar.fetchedAt.slice(0, 10)}`}</p>
    {full && calendar.anonymousContributions > 0 && <p className="small-note">Enthält auch anonym gezählte private Beiträge, wie im GitHub-Kalender. Repository-Namen und Inhalte werden dafür nicht gespeichert.</p>}
  </figure>
}
