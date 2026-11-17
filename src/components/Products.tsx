import { ArrowUpRight } from 'lucide-react'
import type { Product, ProductId } from '../content/site'
import { assetUrl } from '../lib/links'
import { ExternalLink } from './ExternalLink'
import { ProductVisual } from './ProductVisual'

export function Products({ products, onOpen }: { products: Product[]; onOpen: (id: ProductId) => void }) {
  return <section id="work" className="card projects-card" aria-labelledby="work-title" tabIndex={-1}>
    <h2 id="work-title">Turning complexity into <em>something useful.</em></h2>
    <div className="product-grid">
      {products.map((product) => <button key={product.id} className={`product-card product-${product.id}`} onClick={() => onOpen(product.id)} aria-label={`${product.name}: open details`}>
        <ProductVisual id={product.id}/>
        <span className="product-name">{product.name}<ArrowUpRight size={19}/></span>
        <span className="product-summary">{product.summary}</span>
      </button>)}
    </div>
  </section>
}

export function ProductDetail({ product, products, onSelect }: { product: Product; products: Product[]; onSelect: (id: ProductId) => void }) {
  return <div className={`product-detail detail-${product.id}`}>
    <nav className="product-tabs" aria-label="Products">{products.map((item) => <button key={item.id} onClick={() => onSelect(item.id)} aria-pressed={product.id === item.id}>{item.name}</button>)}</nav>
    <div className="detail-intro"><p className="eyebrow">{product.category} / {product.name}</p><h3>{product.headline}</h3><p>{product.summary}</p></div>
    <figure className="detail-visual">{product.image ? <img src={assetUrl(product.image.src)} alt={product.image.alt} loading="lazy"/> : <ProductVisual id={product.id}/>}<figcaption>{product.image ? product.image.alt : 'A product illustration, not a screenshot.'}</figcaption></figure>
    <div className="detail-copy-grid"><section><span className="eyebrow">01 / The starting point</span><h4>The question behind it.</h4><p>{product.problem}</p></section><section><span className="eyebrow">02 / The approach</span><h4>What the product does.</h4><p>{product.approach}</p></section></div>
    <div className="contribution-grid"><section><h4>My contribution</h4><p className={product.contribution ? '' : 'placeholder-copy'}>{product.contribution ?? 'I’ll add the details of my contribution here.'}</p></section><section><h4>A deliberate decision</h4><p className={product.decision ? '' : 'placeholder-copy'}>{product.decision ?? 'The story behind a key product or design decision is coming soon.'}</p></section></div>
    <div className="detail-footer"><ExternalLink href={product.url} className="button primary">Visit {product.name}</ExternalLink>{!product.url && <span className="small-note">Product link coming soon.</span>}<span className="small-note">Part of my product world. No chronological order.</span></div>
  </div>
}
