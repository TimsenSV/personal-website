import { BookOpen, ChevronRight } from 'lucide-react'
import { blogHref, blogPosts, postQuery } from '../content/blog'
import { assetUrl } from '../lib/links'

export function BlogCard() {
  const post = blogPosts[0]
  if (!post) return null

  return <section className="card blog-card" aria-labelledby="blog-title">
    <div className="blog-card-copy">
      <span className="eyebrow"><BookOpen size={14} aria-hidden="true"/>Blog</span>
      <h2 id="blog-title">{post.title}</h2>
      {post.summary && <p>{post.summary}</p>}
      <a className="blog-read" href={blogHref + postQuery(post.slug)}>
        Read more <ChevronRight size={14} aria-hidden="true"/>
      </a>
    </div>
    <div className="blog-card-cover">
      <img src={assetUrl('images/photos/05-evening-small.webp')} alt="" width="480" height="640" loading="lazy"/>
    </div>
  </section>
}
