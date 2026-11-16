import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Product, ProductId } from '../content/site'
import { assetUrl } from '../lib/links'
import { ExternalLink } from './ExternalLink'
import { ProductVisual } from './ProductVisual'

export function Products({ products, onOpen }: { products: Product[]; onOpen: (id: ProductId) => void }) {
  return <section id="work" className="card projects-card" aria-labelledby="work-title" tabIndex={-1}>
    <div className="projects-top"><span className="eyebrow"><span className="tiny-square"/> Meine Arbeit</span><span className="quiet-label">Drei Perspektiven auf E-Commerce</span></div>
    <h2 id="work-title">Aus Komplexität wird <em>ein Produkt.</em></h2>
    <div className="product-grid">
      {products.map((product, index) => <button key={product.id} className={`product-card product-${product.id}`} onClick={() => onOpen(product.id)} aria-label={`${product.name}: Details öffnen`}>
        <span className="product-step"><span>0{index + 1} / {product.category}</span>{index < products.length - 1 && <ArrowRight size={13}/>}</span>
        <ProductVisual id={product.id}/>
        <span className="product-name">{product.name}<ArrowUpRight size={19}/></span>
        <span className="product-summary">{product.summary}</span>
      </button>)}
    </div>
    <div className="project-footnote"><span>Information <ArrowRight/> Darstellung <ArrowRight/> Handlung</span><span>Ein Blick auf meine Arbeit <ArrowDown size={12}/></span></div>
  </section>
}

export function ProductDetail({ product, products, onSelect }: { product: Product; products: Product[]; onSelect: (id: ProductId) => void }) {
  return <div className={`product-detail detail-${product.id}`}>
    <nav className="product-tabs" aria-label="Produkte">{products.map((item) => <button key={item.id} onClick={() => onSelect(item.id)} aria-pressed={product.id === item.id}>{item.name}</button>)}</nav>
    <div className="detail-intro"><p className="eyebrow">{product.category} / {product.name}</p><h3>{product.headline}</h3><p>{product.summary}</p></div>
    <figure className="detail-visual">{product.image ? <img src={assetUrl(product.image.src)} alt={product.image.alt} loading="lazy"/> : <ProductVisual id={product.id}/>}<figcaption>{product.image ? product.image.alt : 'Eine illustrative Produktidee — kein Screenshot.'}</figcaption></figure>
    <div className="detail-copy-grid"><section><span className="eyebrow">01 / Ausgangspunkt</span><h4>Die Frage dahinter.</h4><p>{product.problem}</p></section><section><span className="eyebrow">02 / Ansatz</span><h4>Das macht das Produkt.</h4><p>{product.approach}</p></section></div>
    <div className="contribution-grid"><section><h4>Mein Beitrag</h4><p className={product.contribution ? '' : 'placeholder-copy'}>{product.contribution ?? 'Hier ergänze ich noch meinen konkreten Beitrag.'}</p></section><section><h4>Eine bewusste Entscheidung</h4><p className={product.decision ? '' : 'placeholder-copy'}>{product.decision ?? 'Die Geschichte hinter einer wichtigen Produkt- oder Designentscheidung folgt.'}</p></section></div>
    <div className="detail-footer"><ExternalLink href={product.url} className="button primary">{product.name} besuchen</ExternalLink>{!product.url && <span className="small-note">Produktlink folgt.</span>}<span className="small-note">Teil meiner Produktwelt. Keine zeitliche Reihenfolge.</span></div>
  </div>
}
