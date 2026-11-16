import { useState } from 'react'
import { siteConfig } from './content/site'
import type { ProductId } from './content/site'
import { BoulderGame } from './components/BoulderGame'
import { Dock } from './components/Dock'
import { IntroWidget, GithubDetail, MusicWidget, MusicDetail, RunningWidget, RunningDetail, BoulderWidget } from './components/Widgets'
import { GithubWidget } from './components/GithubWidget'
import { Products, ProductDetail } from './components/Products'
import { Window } from './components/Window'

type Detail = ProductId | 'play' | 'github' | 'music' | 'running'
const titles: Record<Detail, string> = { shopvibes: 'Meine Arbeit / shopvibes', showcase: 'Meine Arbeit / showcase', backlane: 'Meine Arbeit / Backlane', play: 'Eine kleine Pause / Boulder No. 01', github: 'Werkbank / GitHub & Experimente', music: 'Auf den Ohren / Spotify', running: 'Draußen sein / Laufen' }

export default function App() {
  const [detail, setDetail] = useState<Detail | null>(null)
  const product = siteConfig.products.find((item) => item.id === detail)
  return <>
    <a className="skip-link" href="#canvas">Zum Inhalt springen</a>
    <div className="page-shell" id="overview" tabIndex={-1}>
      <main className="bento-grid" id="canvas" tabIndex={-1}>
        <IntroWidget profile={siteConfig.profile}/>
        <Products products={siteConfig.products} onOpen={setDetail}/>
        <GithubWidget config={siteConfig.github} onOpen={() => setDetail('github')}/>
        <MusicWidget config={siteConfig.spotify} onOpen={() => setDetail('music')}/>
        <BoulderWidget onOpen={() => setDetail('play')}/>
        <RunningWidget config={siteConfig.running} onOpen={() => setDetail('running')}/>
      </main>
    </div>
    <Dock profile={siteConfig.profile} username={siteConfig.github.username} onPlay={() => setDetail('play')}/>
    {detail && <Window title={titles[detail]} onClose={() => setDetail(null)} variant={detail === 'play' ? 'game-window' : ''}>
      {product && <ProductDetail product={product} products={siteConfig.products} onSelect={setDetail}/>}
      {detail === 'play' && <BoulderGame/>}
      {detail === 'github' && <GithubDetail config={siteConfig.github}/>}
      {detail === 'music' && <MusicDetail config={siteConfig.spotify}/>}
      {detail === 'running' && <RunningDetail config={siteConfig.running}/>}
    </Window>}
  </>
}
