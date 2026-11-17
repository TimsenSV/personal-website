import { ArrowUpRight, Check, Database, Link2, Sparkles } from 'lucide-react'
import type { Product } from '../content/site'
import { assetUrl } from '../lib/links'
import { BacklaneMark } from './Icons'
import { ProductBrand } from './ProductBrand'

function CoverArt({ id }: { id: Product['id'] }) {
  if (id === 'shopvibes') return <svg viewBox="0 0 180 170" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6"><rect x="27" y="33" width="104" height="105" rx="7" transform="rotate(-12 27 33)" opacity=".35"/><rect x="42" y="24" width="104" height="111" rx="7" transform="rotate(8 42 24)" opacity=".6"/><rect x="36" y="34" width="108" height="114" rx="7" fill="#3159f5"/>
      {[60,86,112].map(y => <g key={y}><rect x="52" y={y} width="12" height="12" rx="3"/><path d={`M77 ${y+3}h48M77 ${y+10}h30`}/></g>)}</g>
  </svg>
  if (id === 'showcase') return <svg viewBox="0 0 180 170" fill="none" aria-hidden="true">
    <path d="M29 156V69a61 61 0 0 1 122 0v87" fill="#ffd5b8"/><circle cx="117" cy="50" r="20" fill="#f7955e"/>
    <ellipse cx="91" cy="151" rx="49" ry="7" fill="#bd4b2c" opacity=".25"/>
    <path d="m63 117-9 35m62-35 10 35" stroke="#713922" strokeWidth="5"/>
    <path d="M57 107V67q0-15 15-15h29q15 0 17 16l5 43" fill="#d45430"/>
    <path d="M51 108q35-14 75 0v15H51z" fill="#943a25"/>
    <path d="M64 60h18M58 115h61" stroke="#ffb18a" strokeWidth="2"/>
  </svg>
  return <span className="book-connection-art" aria-hidden="true"><span className="book-orbit orbit-one"/><span className="book-orbit orbit-two"/><BacklaneMark/><i/><i/><i/></span>
}

function BookArtifacts({ id }: { id: Product['id'] }) {
  const preview = assetUrl(`images/projects/${id}/shelf-preview.jpg`)
  return <span className="book-artifacts" aria-hidden="true">
    <span className={`book-artifact artifact-preview ${id === 'showcase' ? 'artifact-photo' : 'artifact-screen'}`}>
      {id !== 'showcase' && <span className="artifact-screen-bar"><i/><i/><i/></span>}
      <span className="artifact-image"><img src={preview} alt="" width="640" height="360" loading="lazy" decoding="async" draggable={false}/></span>
    </span>
    {id === 'shopvibes' && <>
      <span className="book-artifact artifact-data"><span><Database size={18}/><Check size={13}/></span><i/><i/><i/></span>
      <span className="book-artifact artifact-token"><Check size={22} strokeWidth={3}/></span>
    </>}
    {id === 'showcase' && <>
      <span className="book-artifact artifact-photo artifact-photo-second"><span className="artifact-image"><img src={preview} alt="" width="640" height="360" loading="lazy" decoding="async" draggable={false}/></span></span>
      <span className="book-artifact artifact-token"><Sparkles size={23}/></span>
    </>}
    {id === 'backlane' && <>
      <span className="book-artifact artifact-chat"><span/><span/><span/><i><Check size={12}/></i></span>
      <span className="book-artifact artifact-token"><Link2 size={25}/></span>
    </>}
  </span>
}

export function ProjectBook({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return <button className={`project-volume volume-${product.id}`} onClick={onOpen} aria-label={`${product.name}: open details`}>
    <span className="volume-scene" aria-hidden="true">
      <BookArtifacts id={product.id}/>
      <span className="volume-object"><span className="volume-pages"/><span className="volume-cover"><span className="volume-title"><ProductBrand product={product}/></span><span className="volume-art"><CoverArt id={product.id}/></span><span className="volume-mark">t<span>.</span></span></span></span>
    </span>
    <span className="volume-caption"><strong>{product.name}</strong><span>{product.shortDescription}</span><ArrowUpRight size={16} aria-hidden="true"/></span>
  </button>
}
