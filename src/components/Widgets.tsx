import { useState } from 'react'
import { ArrowUpRight, AudioLines, Code2, FileUser, Footprints, GitBranch, Github, ImagePlus, Play, Plus } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { assetUrl, externalUrl, githubProfile, spotifyPlaylist } from '../lib/links'
import { useGitHubActivity } from '../hooks/useGitHubActivity'
import { BoulderPreview } from './BoulderGame'
import { ExternalLink } from './ExternalLink'
import { RouteDrawing, SpotifyMark, StravaMark } from './Icons'
import { Popout } from './Popout'
import { ChalkClimber } from './ChalkClimber'
import { GitHubHeatmap } from './GitHubHeatmap'
import { PixelRunner } from './PixelRunner'
import { PhotoCarousel } from './PhotoCarousel'
import { CLIMB_NAME } from '../game/climber'

export function IntroWidget({ profile, onOpenCv }: { profile: PortfolioConfig['profile']; onOpenCv: () => void }) {
  return <section className="card intro-card" aria-labelledby="intro-title">
    <div className="portrait-row"><PhotoCarousel photos={profile.photos} name={profile.name}/><div className="intro-name"><h1 id="intro-title">{profile.name}<span>.</span></h1></div></div>
    <div className="intro-copy"><p className="intro-positioning">{profile.positioning}</p></div>
    <div className="intro-actions">
    <Popout className="focus-popout" buttonClassName="current-focus" label="Open current thought" title="On my mind" trigger={<><span className="focus-dot"/><span><span className="eyebrow">On my mind</span><span className="focus-preview">{profile.focus}</span></span><Plus size={15}/></>}>
      <><span className="note-symbol" aria-hidden="true">✳</span><p className="popout-thought">{profile.focus}</p><p>My three products explore it from different angles: information, presentation and action.</p></>
    </Popout>
    <button className="cv-trigger" onClick={onOpenCv} aria-label="Open CV" aria-haspopup="dialog"><FileUser size={18} aria-hidden="true"/><span>CV</span><ArrowUpRight size={14} aria-hidden="true"/></button>
    </div>
  </section>
}

export function GithubDetail({ config }: { config: PortfolioConfig['github'] }) {
  const { state, retry } = useGitHubActivity(config.username)
  return <div className="standard-detail"><p className="eyebrow"><Github size={16}/> The workbench</p><h3>From “What if”<br/><em>to “Look at this”.</em></h3><p>A place for experiments, little tools and ideas I keep coming back to.</p>
    <GitHubHeatmap username={config.username} full/><section className="activity-section"><h4>Public GitHub activity</h4>
      {state.status === 'idle' && <div className="honest-empty"><GitBranch size={25}/><p>No GitHub profile connected yet.<span>Once my username is added, real public activity will appear here.</span></p></div>}
      {state.status === 'loading' && <p role="status" className="loading-copy">Loading activity from GitHub …</p>}
      {state.status === 'empty' && <p className="honest-empty" role="status">No public activity in GitHub’s current window. That doesn’t mean nothing is being built.</p>}
      {state.status === 'error' && <div className="honest-empty" role="status"><p>{state.message}</p><button className="button secondary" onClick={retry}>Try again</button></div>}
      {state.status === 'success' && <ul className="activity-list">{state.activities.map((activity) => <li key={activity.id}><GitBranch size={17}/><div><ExternalLink href={activity.url}>{activity.repository}</ExternalLink><p>{activity.label}</p></div><time dateTime={activity.date}>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(activity.date))}</time></li>)}</ul>}
      {config.username && <p className="small-note">Recent public GitHub events, with a delay. This isn’t a complete contribution history.</p>}
    </section>
    <section className="selected-repositories"><h4>Selected experiments</h4>{config.repositories.length ? config.repositories.map((repository) => <article key={repository.name}><Code2 size={23}/><div><h5>{repository.name}</h5><p>{repository.description}</p><div className="tag-row">{repository.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><ExternalLink href={repository.url}>View repository</ExternalLink>{!repository.url && <span className="small-note">Still local. Public link coming soon.</span>}</div></article>) : <p className="placeholder-copy">I’ll add my selection here soon.</p>}</section>
    <ExternalLink className="button primary" href={githubProfile(config.username)}>View GitHub profile</ExternalLink>
  </div>
}

export function MusicWidget({ config, onOpen }: { config: PortfolioConfig['spotify']; onOpen: () => void }) {
  const playlist = spotifyPlaylist(config.url)
  const [failedCover, setFailedCover] = useState<string | null>(null)
  return <section className="card music-card" aria-labelledby="music-title">
    <div className="record-artwork"><button type="button" className="record-object" aria-label="Open playlist" aria-haspopup="dialog" onClick={onOpen}>
      <span className="vinyl-disc" aria-hidden="true"><span><AudioLines size={20}/></span></span>
      <span className="record-sleeve">{config.cover && failedCover !== config.cover.src ? <img src={assetUrl(config.cover.src)} alt={config.cover.alt} width="160" height="160" loading="lazy" onError={() => setFailedCover(config.cover?.src ?? null)}/> : <span className="album-art" aria-hidden="true"><span className="album-art-title">A SIDE<br/>OF ME<span>01</span></span><span className="album-star">✳</span><span className="album-art-bottom">MUSIC IS A GOOD PLACE.</span></span>}</span>
      <span className="record-sticker" aria-hidden="true">{playlist ? 'LISTEN IN ↗' : 'PLAYLIST SOON'}</span>
    </button></div>
    <div className="playlist-copy"><h2 id="music-title">{config.title}</h2>{playlist && config.note && <p>{config.note}</p>}</div>
    <div className="music-bottom"><SpotifyMark className="spotify-mark"/><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/><i/></span></div>
  </section>
}

export function MusicDetail({ config }: { config: PortfolioConfig['spotify'] }) {
  const playlist = spotifyPlaylist(config.url)
  return <div className="music-detail">{playlist ? <>
    <iframe className="spotify-embed" src={playlist.embed} title={`Spotify playlist: ${config.title}`} width="100%" height="520" allow="encrypted-media; fullscreen; picture-in-picture" loading="lazy"/>
    <ExternalLink href={playlist.url} className="button primary">Open on Spotify</ExternalLink>
  </> : <div className="honest-empty"><ImagePlus size={24}/><p>Playlist coming soon. Until then, a little quiet.</p></div>}</div>
}

export function RunningWidget({ config, onOpen }: { config: PortfolioConfig['running']; onOpen: () => void }) {
  const scene = <span className="runner-scene" aria-hidden="true"><span className="runner-track"/><span className="runner-speed"><i/><i/><i/></span><PixelRunner/></span>
  return <section className="card running-card runner-card" aria-labelledby="running-title">
    <div className="runner-heading"><h2 id="running-title" lang="en">{config.title}</h2><button className="round-link" onClick={onOpen} aria-label="Running: open details"><ArrowUpRight size={18}/></button></div>
    {externalUrl(config.stravaUrl) ? <ExternalLink href={config.stravaUrl} className="strava-run-link">{scene}<span className="strava-follow"><StravaMark/>Run with me on Strava</span></ExternalLink> : <>{scene}<span className="small-note">Strava link coming soon.</span></>}
  </section>
}

export function RunningDetail({ config }: { config: PortfolioConfig['running'] }) {
  return <div className="standard-detail running-detail"><p className="eyebrow"><Footprints size={16}/> Running</p><h3>{config.title}</h3><p>{config.note}</p><ExternalLink href={config.stravaUrl} className="button primary">Run with me on Strava</ExternalLink><figure><RouteDrawing/><figcaption>An abstract illustration, not a recorded route.</figcaption></figure><div className="contribution-grid"><section><h4>My favourite route</h4><p className={config.routeName ? '' : 'placeholder-copy'}>{config.routeName ?? 'I’ll add it here soon.'}</p></section><section><h4>What I’m running towards</h4><p className={config.goal ? '' : 'placeholder-copy'}>{config.goal ?? 'A space for my next running goal.'}</p></section></div></div>
}

export function BoulderWidget({ onOpen }: { onOpen: () => void }) {
  const [chalkCue, setChalkCue] = useState(0)
  return <section className="card boulder-card" aria-labelledby="boulder-title" onPointerEnter={(event) => { if (event.pointerType !== 'touch') setChalkCue(value => value + 1) }} onFocus={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setChalkCue(value => value + 1) }}><div className="boulder-heading"><h2 id="boulder-title" lang="en">{CLIMB_NAME}.</h2><span className="boulder-number" aria-hidden="true">∞</span></div><div className="boulder-scene"><button className="boulder-preview-button" onClick={onOpen} aria-label="Open and play the climbing game"><BoulderPreview/><span className="board-open-hint"><Play size={12} fill="currentColor"/> Start climbing</span></button><div className="boulder-avatar"><ChalkClimber cue={chalkCue}/></div></div><div className="boulder-bottom"><button className="round-link" onClick={onOpen} aria-label="Start climbing game"><ArrowUpRight size={18}/></button></div></section>
}
