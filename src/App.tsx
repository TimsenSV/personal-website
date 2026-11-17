import { useRef, useState } from 'react'
import { siteConfig } from './content/site'
import type { ProductId } from './content/site'
import { BoulderGame } from './components/BoulderGame'
import { Dock } from './components/Dock'
import { IntroWidget, GithubDetail, MusicWidget, RunningWidget, RunningDetail, BoulderWidget } from './components/Widgets'
import { PlaylistWindow } from './components/PlaylistWindow'
import { useSpotifyConsent } from './hooks/useSpotifyConsent'
import { spotifyPlaylist } from './lib/links'
import { GithubWidget } from './components/GithubWidget'
import { Products, ProductDetail, ProjectNavigation, WorkOverview } from './components/Products'
import { Window } from './components/Window'
import { CvDetail } from './components/CvDetail'
import { cvConfig } from './content/cv'
import { CLIMB_NAME } from './game/climber'
import { useCanvasTilt } from './hooks/useCanvasTilt'
import { LegalNotice } from './components/LegalNotice'

type Detail = ProductId | 'work' | 'play' | 'github' | 'music' | 'running' | 'cv' | 'legal' | 'privacy'
const titles: Record<Detail, string> = { work: 'My work', shopvibes: 'My work / shopvibes', showcase: 'My work / showcase', backlane: 'My work / backlane', play: CLIMB_NAME, github: 'Workbench / GitHub & experiments', music: 'On repeat / Spotify', running: 'Outside / Running', cv: `CV / ${cvConfig.name}`, legal: 'Impressum & Privacy', privacy: 'Impressum & Privacy' }

export default function App() {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [musicMinimized, setMusicMinimized] = useState(false)
  const musicTrigger = useRef<HTMLButtonElement>(null)
  const { allowed } = useSpotifyConsent()
  if (musicMinimized && !allowed) setMusicMinimized(false)
  const canvasRef = useCanvasTilt()
  const product = siteConfig.products.find((item) => item.id === detail)
  const isLegal = detail === 'legal' || detail === 'privacy'
  return <>
    <a className="skip-link" href="#canvas">Skip to content</a>
    <div className={`page-shell${musicMinimized ? ' has-music-notch' : ''}`} id="overview" tabIndex={-1}>
      <main ref={canvasRef} className="bento-grid" id="canvas" tabIndex={-1}>
        <IntroWidget profile={siteConfig.profile} onOpenCv={() => setDetail('cv')}/>
        <Products products={siteConfig.products} onOpen={setDetail}/>
        <GithubWidget config={siteConfig.github} onOpen={() => setDetail('github')}/>
        <MusicWidget config={siteConfig.spotify} onOpen={trigger => { musicTrigger.current = trigger; setDetail('music') }}/>
        <BoulderWidget onOpen={() => setDetail('play')}/>
        <RunningWidget config={siteConfig.running} onOpen={() => setDetail('running')}/>
      </main>
    </div>
    <Dock profile={siteConfig.profile} username={siteConfig.github.username} playlistUrl={siteConfig.spotify.url} onPlay={() => setDetail('play')} onWork={() => setDetail('work')} onLegal={() => setDetail('legal')}/>
    {(detail === 'music' || musicMinimized) && <PlaylistWindow
      config={siteConfig.spotify} minimized={detail !== 'music'} trigger={musicTrigger}
      onRestore={() => setDetail('music')} onPrivacy={() => setDetail('privacy')}
      onClose={() => { setMusicMinimized(allowed && !!spotifyPlaylist(siteConfig.spotify.url)); setDetail(null) }}
      onStop={() => { setMusicMinimized(false); musicTrigger.current?.focus({ preventScroll: true }) }}
    />}
    {detail && detail !== 'music' && <Window title={titles[detail]} expandable={detail !== 'play' && !isLegal} initialFocus={detail === 'play' ? '[data-game-start]' : isLegal ? '[data-legal-tab][aria-pressed="true"]' : undefined} onClose={() => setDetail(null)} variant={detail === 'play' ? 'game-window' : detail === 'cv' ? 'cv-window' : isLegal ? 'legal-window' : detail === 'work' || product ? 'work-window' : ''}
      toolbar={product && <ProjectNavigation product={product} products={siteConfig.products} onSelect={setDetail} onOverview={() => setDetail('work')}/>}>
      {detail === 'work' && <WorkOverview products={siteConfig.products} onOpen={setDetail}/>}
      {product && <ProductDetail product={product}/>}
      {detail === 'play' && <BoulderGame/>}
      {detail === 'github' && <GithubDetail config={siteConfig.github}/>}
      {detail === 'running' && <RunningDetail config={siteConfig.running}/>}
      {detail === 'cv' && <CvDetail config={cvConfig}/>}
      {isLegal && <LegalNotice config={siteConfig.legal} initialSection={detail === 'privacy' ? 'privacy' : 'imprint'}/>}
    </Window>}
  </>
}
