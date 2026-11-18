import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { blogDate, blogPosts, postQuery, type BlogPost } from '../content/blog'
import { siteConfig } from '../content/site'
import { useInputModality } from '../hooks/useInputModality'
import { renderBlogMarkdown, type ReadingPoint } from '../lib/blogMarkdown'
import { ExternalLink } from './ExternalLink'
import { LegalNotice } from './LegalNotice'
import { Window } from './Window'

function PostDate({ date }: { date: string }) {
  return <time className="blog-date" dateTime={date}>{blogDate(date)}</time>
}

function BlogIndex({ missingPost }: { missingPost: boolean }) {
  return <main className="blog-index" id="blog-content" tabIndex={-1}>
    <h1>{missingPost ? 'Post not found.' : 'Blog.'}</h1>
    {missingPost && <p className="blog-index-note">Here are the available posts.</p>}
    <ul className="blog-list">
      {blogPosts.map(post => <li key={post.slug}>
        <a className="blog-list-entry" href={postQuery(post.slug)}>
          <span className="blog-list-copy"><span className="blog-list-title">{post.title}</span>{post.summary && <span className="blog-list-summary">{post.summary}</span>}</span>
          <PostDate date={post.date}/>
          <ArrowUpRight className="blog-entry-arrow" size={16} aria-hidden="true"/>
        </a>
      </li>)}
    </ul>
  </main>
}

function ReadingLinks({ points, active }: { points: ReadingPoint[]; active: string | undefined }) {
  return <ol className="blog-reading-list">
    {points.map(({ id, label, level }) => <li key={id} data-level={level}>
      <a href={`#${id}`} aria-current={id === active ? 'location' : undefined}
        onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>{label}</a>
    </li>)}
  </ol>
}

function BlogArticle({ post }: { post: BlogPost }) {
  const { html, points } = useMemo(() => renderBlogMarkdown(post.markdown), [post.markdown])
  const [active, setActive] = useState<string | undefined>(points[0]?.id)
  const outline = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = points.map(point => document.getElementById(point.id)).filter(el => el !== null)
    if (!sections.length) return
    let frame = 0

    function updateReadingPoint() {
      frame = 0
      const threshold = Math.min(140, window.innerHeight * .24)
      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top > threshold) break
        current = section.id
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id
      }
      setActive(current)
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateReadingPoint)
    }

    const linkedSection = sections.find(section => window.location.hash === `#${encodeURIComponent(section.id)}`)
    linkedSection?.scrollIntoView({ behavior: 'instant' })
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [points])

  useEffect(() => {
    const nav = outline.current
    const selected = nav?.querySelector('[aria-current="location"]')
    if (!nav || !selected || nav.scrollHeight <= nav.clientHeight) return
    const rail = nav.getBoundingClientRect()
    const link = selected.getBoundingClientRect()
    if (link.bottom > rail.bottom) nav.scrollTop += link.bottom - rail.bottom
    if (link.top < rail.top) nav.scrollTop -= rail.top - link.top
  }, [active])

  return <main className="blog-reader" id="blog-content" tabIndex={-1}>
    {points.length > 0 && <nav ref={outline} className="blog-outline" aria-label="On this page">
      <p className="blog-outline-title">On this page</p>
      <ReadingLinks points={points} active={active}/>
    </nav>}
    <article className="blog-article">
      <header className="blog-article-header">
        <PostDate date={post.date}/>
        <h1>{post.title}</h1>
      </header>
      {points.length > 0 && <details className="blog-mobile-outline">
        <summary>On this page</summary>
        <ReadingLinks points={points} active={active}/>
      </details>}
      <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }}/>
      <aside className="blog-feedback" aria-label="Feedback">
        <ExternalLink className="blog-feedback-link" href={siteConfig.profile.linkedinUrl}>
          <span>You can disagree with me here.<small>LinkedIn</small></span>
        </ExternalLink>
      </aside>
    </article>
  </main>
}

export function BlogPage({ post, missingPost }: { post: BlogPost | undefined; missingPost: boolean }) {
  useInputModality()
  const [legalOpen, setLegalOpen] = useState(false)

  return <div className="blog-shell">
    <a className="skip-link" href="#blog-content">Skip to content</a>
    <header className="blog-top">
      <a className="blog-wordmark" href="../" aria-label="Timsen home">timsen<span>.</span></a>
      {post && <a className="blog-back" href="./"><ArrowLeft size={14} aria-hidden="true"/>All posts</a>}
    </header>
    {post ? <BlogArticle post={post}/> : <BlogIndex missingPost={missingPost}/>}
    <footer className="site-footer blog-footer">
      <button className="legal-text-button" type="button" aria-haspopup="dialog" onClick={() => setLegalOpen(true)}>Impressum &amp; Privacy</button>
    </footer>
    {legalOpen && <Window title="Impressum & Privacy" variant="legal-window" expandable={false}
      initialFocus='[data-legal-tab][aria-pressed="true"]' onClose={() => setLegalOpen(false)}>
      <LegalNotice config={siteConfig.legal}/>
    </Window>}
  </div>
}
