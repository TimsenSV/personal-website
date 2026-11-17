import { createRoot } from 'react-dom/client'
import { ArrowUpRight } from 'lucide-react'
import '@fontsource-variable/dm-sans'
import '../src/styles.css'
import '../src/work-shelf.css'
import { ProjectBook } from '../src/components/ProjectBook'
import { siteConfig } from '../src/content/site'
import './social-preview.css'

const portrait = siteConfig.profile.photos[0]

createRoot(document.getElementById('root')!).render(
  <main className="sharing-artboard">
    <section className="sharing-intro">
      <div className="sharing-address"><img src="/favicon.svg" alt="" width="30" height="30"/><span>timsen.me</span><ArrowUpRight size={22}/></div>
      <h1>Tim Hoffmann<span>.</span></h1>
      <p>Product, UX & an<br/>entrepreneurial mindset.</p>
    </section>
    <section className="sharing-work" aria-label="My work">
      {siteConfig.products.map(product => <ProjectBook key={product.id} product={product} onOpen={() => undefined}/>)}
    </section>
    <section className="sharing-portrait" aria-label="Portrait">
      <div className="sharing-polaroid back-one"/>
      <div className="sharing-polaroid back-two"/>
      <figure className="sharing-polaroid front">
        <img src={`/${portrait.src}`} alt={portrait.alt} width={portrait.width} height={portrait.height}/>
        <figcaption><span>Hey, I’m Tim.</span><span>01 / 07</span></figcaption>
      </figure>
      <div className="sharing-hello">A little bit of me<span>↗</span></div>
    </section>
  </main>,
)
