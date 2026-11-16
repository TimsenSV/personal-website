import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { siteConfig } from '../src/content/site.ts'

const username = siteConfig.github.username
if (!username || !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
  throw new Error('Bitte einen gültigen GitHub-Nutzernamen in src/content/site.ts hinterlegen.')
}
const query = `query($login:String!){user(login:$login){login contributionsCollection {
  restrictedContributionsCount
  contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } }
}}}`
const body = JSON.stringify({ query, variables: { login: username } })
// Authentication stays in the build process. Only anonymous daily totals are written.
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN
let response
if (token) {
  const result = await fetch('https://api.github.com/graphql', {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body, signal: AbortSignal.timeout(20000),
  })
  if (!result.ok) throw new Error(`GitHub API nicht erreichbar (HTTP ${result.status}). Vorhandene Daten bleiben erhalten.`)
  response = await result.json()
} else {
  response = await new Promise((resolve, reject) => {
    const child = spawn('gh', ['api', 'graphql', '--input', '-'], { stdio: ['pipe', 'pipe', 'pipe'], timeout: 20000 })
    let output = ''
    child.stdout.on('data', chunk => { output += chunk })
    child.on('error', () => reject(new Error('GitHub CLI nicht verfügbar. gh auth login oder ein Build-Secret verwenden.')))
    child.on('close', code => {
      if (code !== 0) return reject(new Error('GitHub-Abfrage fehlgeschlagen. gh auth status prüfen. Vorhandene Daten bleiben erhalten.'))
      try { resolve(JSON.parse(output)) } catch { reject(new Error('Ungültige GitHub-Antwort.')) }
    })
    child.stdin.on('error', () => {})
    child.stdin.end(body)
  })
}
if (response.errors || !response.data?.user) throw new Error('GitHub hat keinen vollständigen Kalender zurückgegeben.')
const { login, contributionsCollection: collection } = response.data.user
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
const days = collection.contributionCalendar.weeks.flatMap(week => week.contributionDays).map(day => ({
  date: day.date, count: day.contributionCount, level: levels.indexOf(day.contributionLevel),
}))
if (days.length < 350 || days.some(day => !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0 || day.level < 0)) throw new Error('Unvollständige Kalenderdaten.')
const snapshot = {
  version: 1, username: login, fetchedAt: new Date().toISOString(), source: 'GitHub GraphQL API',
  total: collection.contributionCalendar.totalContributions,
  anonymousContributions: collection.restrictedContributionsCount, days,
}
if (days.reduce((sum, day) => sum + day.count, 0) !== snapshot.total) throw new Error('Die Tageswerte stimmen nicht mit der Gesamtsumme überein.')
await mkdir(new URL('../public/data/', import.meta.url), { recursive: true })
await writeFile(new URL('../public/data/github-contributions.json', import.meta.url), `${JSON.stringify(snapshot)}\n`)
console.log(`GitHub-Kalender für ${login}: ${days.length} Tage, ${snapshot.total} Beiträge. Keine Repository-Details gespeichert.`)
