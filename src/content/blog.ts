export type BlogPost = {
  issue: number
  slug: string
  date: string
  title: string
  summary?: string
  markdown: string
}

const sources = import.meta.glob<string>('./blog/*.md', { eager: true, query: '?raw', import: 'default' })
const issues = new Set<number>()

export const blogPosts = Object.entries(sources).map(([path, source]): BlogPost => {
  const filename = /\/(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(path)
  const entry = /^# ((\d{2,}) - [^\n]+)\n[ \t]*\n([\s\S]+)$/.exec(source.trim().replace(/\r\n/g, '\n'))

  if (!filename || !entry) {
    throw new Error(`Blog post needs a YYYY-MM-DD-slug.md filename, a numbered title and a body: ${path}`)
  }

  const [, title, number, body] = entry
  const issue = Number(number)
  if (!Number.isSafeInteger(issue) || issue < 1 || issues.has(issue)) {
    throw new Error(`Blog post needs a unique positive issue number: ${path}`)
  }
  issues.add(issue)

  const teaser = /^<!-- summary: ([^\n]+) -->\n[ \t]*\n/.exec(body)
  const markdown = teaser ? body.slice(teaser[0].length) : body
  return { issue, date: filename[1], slug: filename[2], title, summary: teaser?.[1], markdown }
}).sort((a, b) => b.issue - a.issue)

export const blogHref = './blog/'
export const postQuery = (slug: string) => `?post=${encodeURIComponent(slug)}`

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const blogDate = (date: string) => dateFormat.format(new Date(`${date}T00:00:00Z`))
