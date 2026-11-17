import { useState } from 'react'
import { siteConfig } from './content/site'
import type { ProductId } from './content/site'
import { BoulderGame } from './components/BoulderGame'
import { Dock } from './components/Dock'
import { IntroWidget, GithubDetail, MusicWidget, MusicDetail, RunningWidget, RunningDetail, BoulderWidget } from './components/Widgets'
import { GithubWidget } from './components/GithubWidget'
import { Products, ProductDetail, WorkOverview } from './components/Products'
import { Window } from './components/Window'
import { CvDetail } from './components/CvDetail'
import { cvConfig } from './content/cv'
import { CLIMB_NAME } from './game/climber'
import { useCanvasTilt } from './hooks/useCanvasTilt'

type Detail = ProductId | 'work' | 'play' | 'github' | 'music' | 'running' | 'cv'
const titles: Record<Detail, string> = { work: 'My work', shopvibes: 'My work / shopvibes', showcase: 'My work / showcase', backlane: 'My work / Backlane', play: CLIMB_NAME, github: 'Workbench / GitHub & experiments', music: 'On repeat / Spotify', running: 'Outside / Running', cv: `CV / ${cvConfig.name}` }

export default function App() {
  const [detail, setDetail] = useState<Detail | null>(null)
  const canvasRef = useCanvasTilt()
  const product = siteConfig.products.find((item) => item.id === detail)
  return <>
    <a className="skip-link" href="#canvas">Skip to content</a>
    <div className="page-shell" id="overview" tabIndex={-1}>
      <main ref={canvasRef} className="bento-grid" id="canvas" tabIndex={-1}>
        <IntroWidget profile={siteConfig.profile} onOpenCv={() => setDetail('cv')}/>
        <Products products={siteConfig.products} onOpen={setDetail}/>
        <GithubWidget config={siteConfig.github} onOpen={() => setDetail('github')}/>
        <MusicWidget config={siteConfig.spotify} onOpen={() => setDetail('music')}/>
        <BoulderWidget onOpen={() => setDetail('play')}/>
        <RunningWidget config={siteConfig.running} onOpen={() => setDetail('running')}/>
      </main>
    </div>
    <Dock profile={siteConfig.profile} username={siteConfig.github.username} playlistUrl={siteConfig.spotify.url} onPlay={() => setDetail('play')} onWork={() => setDetail('work')}/>
    {detail && <Window title={titles[detail]} expandable={detail !== 'play'} initialFocus={detail === 'play' ? '[data-game-start]' : undefined} onClose={() => setDetail(null)} variant={detail === 'play' ? 'game-window' : detail === 'cv' ? 'cv-window' : ''}>
      {detail === 'work' && <WorkOverview products={siteConfig.products} onOpen={setDetail}/>}
      {product && <ProductDetail product={product} products={siteConfig.products} onSelect={setDetail} onOverview={() => setDetail('work')}/>}
      {detail === 'play' && <BoulderGame/>}
      {detail === 'github' && <GithubDetail config={siteConfig.github}/>}
      {detail === 'music' && <MusicDetail config={siteConfig.spotify}/>}
      {detail === 'running' && <RunningDetail config={siteConfig.running}/>}
      {detail === 'cv' && <CvDetail config={cvConfig}/>}
    </Window>}
  </>
}
