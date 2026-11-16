import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { externalUrl } from '../lib/links'

export function ExternalLink({ href, children, className = '' }: { href: string | null; children: ReactNode; className?: string }) {
  const url = externalUrl(href)
  if (!url) return null
  return <a href={url} target="_blank" rel="noopener noreferrer" className={`external-link ${className}`}>
    {children}<ArrowUpRight size={15} aria-hidden="true"/><span className="sr-only"> (öffnet einen neuen Tab)</span>
  </a>
}
