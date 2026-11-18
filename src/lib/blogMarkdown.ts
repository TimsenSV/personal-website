import MarkdownIt from 'markdown-it'

export type ReadingPoint = { id: string; label: string; level: number }

const markdown = new MarkdownIt({ html: false, typographer: true })

export function renderBlogMarkdown(source: string) {
  const env = {}
  const tokens = markdown.parse(source, env)
  const points: ReadingPoint[] = []
  const used = new Set<string>()

  tokens.forEach((token, index) => {
    if (token.type !== 'heading_open' || (token.tag !== 'h2' && token.tag !== 'h3')) return
    const label = tokens[index + 1].children?.map(child => child.type === 'softbreak' ? ' ' : child.content).join('') ?? ''
    const slug = label.toLowerCase().normalize('NFKD').replace(/\p{Mark}/gu, '')
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '') || 'section'
    const base = `read-${slug}`
    let id = base

    for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`
    used.add(id)
    token.attrSet('id', id)
    points.push({ id, label, level: Number(token.tag[1]) })
  })

  return { html: markdown.renderer.render(tokens, markdown.options, env), points }
}
