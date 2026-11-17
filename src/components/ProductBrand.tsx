import type { Product } from '../content/site'
import { assetUrl } from '../lib/links'

export function ProductBrand({ product }: { product: Product }) {
  return <img className={`product-brand brand-${product.id}`} src={assetUrl(product.logo.src)} alt={product.logo.alt} width="180" height="38" decoding="async"/>
}
