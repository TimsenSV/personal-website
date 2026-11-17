import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Product, ProductId } from '../content/site'
import { ExternalLink } from './ExternalLink'
import { ProductVisual } from './ProductVisual'
import { ProjectBook } from './ProjectBook'
import { ProductGallery } from './ProductGallery'

function useProjectHeading(page: string) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const heading = ref.current
    const body = heading?.closest('.window-body')
    if (body) body.scrollTop = 0
    // A view change removes the previous button; keep keyboard users in the app.
    if (document.activeElement === document.body && heading?.closest('dialog')?.open) heading.focus({ preventScroll: true })
  }, [page])
  return ref
}

export function Products({ products, onOpen }: { products: Product[]; onOpen: (id: ProductId) => void }) {
  return <section id="work" className="card projects-card work-shelf-card" aria-labelledby="work-title" tabIndex={-1}>
    <h2 id="work-title">My work<span>.</span></h2>
    <div className="project-shelf">
      {products.map(product => <ProjectBook key={product.id} product={product} onOpen={() => onOpen(product.id)}/>)}
    </div>
  </section>
}

export function WorkOverview({ products, onOpen }: { products: Product[]; onOpen: (id: ProductId) => void }) {
  const headingRef = useProjectHeading('overview')
  return <div className="work-overview">
    <h3 ref={headingRef} tabIndex={-1}>Products I build & shape<span>.</span></h3>
    <div className="work-library">{products.map(product => <article key={product.id}>
      <ProjectBook product={product} onOpen={() => onOpen(product.id)}/>
      {product.role && <p className="library-role">{product.role}</p>}
      <p className="library-summary">{product.summary}</p>
    </article>)}</div>
  </div>
}

export function ProductDetail({ product, products, onSelect, onOverview }: { product: Product; products: Product[]; onSelect: (id: ProductId) => void; onOverview: () => void }) {
  const headingRef = useProjectHeading(product.id)
  return <div className={`product-detail detail-${product.id}`}>
    <button className="work-back" onClick={onOverview}><ArrowLeft size={16}/>All projects</button>
    <nav className="product-tabs" aria-label="Products">{products.map((item) => <button key={item.id} onClick={() => onSelect(item.id)} aria-pressed={product.id === item.id}>{item.name}</button>)}</nav>
    <div className="detail-intro"><p className="eyebrow">{product.category} / {product.name}</p><h3 ref={headingRef} tabIndex={-1}>{product.headline}</h3><p>{product.summary}</p>{product.role && <p className="project-role">My role <strong>{product.role}</strong></p>}</div>
    {product.screenshots.length || product.image ? <ProductGallery key={product.id} name={product.name} screenshots={product.screenshots.length ? product.screenshots : [product.image!]}/> : <figure className="detail-visual"><ProductVisual id={product.id}/><figcaption>Product illustration. Screenshots coming soon.</figcaption></figure>}
    <div className="detail-copy-grid"><section><span className="eyebrow">01 / The starting point</span><h4>The question behind it.</h4><p>{product.problem}</p></section><section><span className="eyebrow">02 / The approach</span><h4>What the product does.</h4><p>{product.approach}</p></section></div>
    <div className="contribution-grid"><section><h4>My contribution</h4><p className={product.contribution ? '' : 'placeholder-copy'}>{product.contribution ?? 'I’ll add the details of my contribution here.'}</p></section><section><h4>A deliberate decision</h4><p className={product.decision ? '' : 'placeholder-copy'}>{product.decision ?? 'The story behind a key product or design decision is coming soon.'}</p></section></div>
    <div className="detail-footer"><ExternalLink href={product.url} className="button primary">Visit {product.name}</ExternalLink>{!product.url && <span className="small-note">Product link coming soon.</span>}<span className="small-note">Part of my product world. No chronological order.</span></div>
  </div>
}
