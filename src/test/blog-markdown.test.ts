import { describe, expect, it } from 'vitest'
import { renderBlogMarkdown } from '../lib/blogMarkdown'

describe('blog Markdown', () => {
  it('keeps heading labels readable and gives repeated sections distinct link targets', () => {
    const { html, points } = renderBlogMarkdown('## Café **notes**\n\n### Café notes\n\n### Café notes 2')
    expect(points).toEqual([
      { id: 'read-cafe-notes', label: 'Café notes', level: 2 },
      { id: 'read-cafe-notes-2', label: 'Café notes', level: 3 },
      { id: 'read-cafe-notes-2-2', label: 'Café notes 2', level: 3 },
    ])
    const article = document.createElement('article')
    article.innerHTML = html
    expect([...article.querySelectorAll('h2, h3')].map(heading => heading.id)).toEqual(points.map(point => point.id))
  })

  it('renders Markdown quotes and treats raw HTML and unsafe links as text', () => {
    const { html } = renderBlogMarkdown('> A quote\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)')
    const article = document.createElement('article')
    article.innerHTML = html
    expect(article.querySelector('blockquote')).toHaveTextContent('A quote')
    expect(article.querySelector('script, a')).toBeNull()
  })
})
