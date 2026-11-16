import { useState } from 'react'
import { ArrowRight, ArrowUpRight, AudioLines, Camera, Code2, Footprints, GitBranch, Github, ImagePlus, Linkedin, Play, Plus, Sparkles } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { assetUrl, externalUrl, githubProfile, spotifyPlaylist } from '../lib/links'
import { useGitHubActivity } from '../hooks/useGitHubActivity'
import { BoulderPreview } from './BoulderGame'
import { ExternalLink } from './ExternalLink'
import { RouteDrawing, SpotifyMark } from './Icons'
import { Popout } from './Popout'
import { ChalkClimber } from './ChalkClimber'
import { GitHubHeatmap } from './GitHubHeatmap'

export function IntroWidget({ profile }: { profile: PortfolioConfig['profile'] }) {
  return <section className="card intro-card" aria-labelledby="intro-title">
    <div className="intro-top"><span className="eyebrow">Ein bisschen ich</span><span className="intro-spark" aria-hidden="true">✳</span></div>
    <div className="portrait-row"><div className="portrait-stack">{profile.portrait ? <img className="portrait" src={assetUrl(profile.portrait.src)} alt={profile.portrait.alt} width="76" height="88"/> : <span className="portrait-placeholder" role="img" aria-label="Platzhalter für ein echtes Porträt"><Camera size={24} strokeWidth={1.5}/><small>Foto folgt</small></span>}<span className="portrait-caption" aria-hidden="true">hello, world.</span></div><div><span className="intro-greeting">Hi, ich bin</span><h1 id="intro-title">{profile.name}<span>.</span></h1></div></div>
    <p className="intro-positioning">{profile.positioning}</p>
    <p className="intro-description">{profile.introduction}</p>
    <p className="intro-personal">{profile.personal}</p>
    <Popout className="focus-popout" buttonClassName="current-focus" label="Aktuellen Gedanken aufklappen" title="Gerade im Kopf" trigger={<><span className="focus-dot"/><span><span className="eyebrow">Gerade im Kopf</span><span className="focus-preview">{profile.focus}</span></span><Plus size={15}/></>}>
      <><span className="note-symbol" aria-hidden="true">✳</span><p className="popout-thought">{profile.focus}</p><p>Meine drei Produkte zeigen verschiedene Perspektiven darauf: Information, Darstellung und Handlung.</p></>
    </Popout>
    {externalUrl(profile.linkedinUrl) && <div className="linkedin-widget"><Linkedin size={16}/><ExternalLink href={profile.linkedinUrl}>Auf LinkedIn verbinden</ExternalLink></div>}
  </section>
}

export function GithubDetail({ config }: { config: PortfolioConfig['github'] }) {
  const { state, retry } = useGitHubActivity(config.username)
  return <div className="standard-detail"><p className="eyebrow"><Github size={16}/> Die Werkbank</p><h3>Von „Was wäre, wenn“<br/><em>zu „Schau mal“.</em></h3><p>Ein Platz für Experimente, kleine Werkzeuge und Dinge, an denen ich weiterdenke.</p>
    <GitHubHeatmap username={config.username} full/><section className="activity-section"><h4>Öffentliche GitHub-Aktivität</h4>
      {state.status === 'idle' && <div className="honest-empty"><GitBranch size={25}/><p>Hier ist noch kein GitHub-Profil verbunden.<span>Sobald mein Nutzername hinterlegt ist, erscheinen hier echte öffentliche Aktivitäten.</span></p></div>}
      {state.status === 'loading' && <p role="status" className="loading-copy">Aktivität wird von GitHub geladen …</p>}
      {state.status === 'empty' && <p className="honest-empty" role="status">Im aktuellen GitHub-Zeitraum sind keine öffentlichen Aktivitäten sichtbar. Das heißt nicht, dass nichts entsteht.</p>}
      {state.status === 'error' && <div className="honest-empty" role="status"><p>{state.message}</p><button className="button secondary" onClick={retry}>Erneut versuchen</button></div>}
      {state.status === 'success' && <ul className="activity-list">{state.activities.map((activity) => <li key={activity.id}><GitBranch size={17}/><div><ExternalLink href={activity.url}>{activity.repository}</ExternalLink><p>{activity.label}</p></div><time dateTime={activity.date}>{new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(new Date(activity.date))}</time></li>)}</ul>}
      {config.username && <p className="small-note">Aktuelle öffentliche Ereignisse von GitHub, zeitverzögert. Kein vollständiger Contribution-Verlauf.</p>}
    </section>
    <section className="selected-repositories"><h4>Ausgewählte Experimente</h4>{config.repositories.length ? config.repositories.map((repository) => <article key={repository.name}><Code2 size={23}/><div><h5>{repository.name}</h5><p>{repository.description}</p><div className="tag-row">{repository.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><ExternalLink href={repository.url}>Repository ansehen</ExternalLink>{!repository.url && <span className="small-note">Noch lokal. Der öffentliche Link folgt.</span>}</div></article>) : <p className="placeholder-copy">Meine Auswahl ergänze ich hier noch.</p>}</section>
    <ExternalLink className="button primary" href={githubProfile(config.username)}>Zum GitHub-Profil</ExternalLink>
  </div>
}

export function MusicWidget({ config, onOpen }: { config: PortfolioConfig['spotify']; onOpen: () => void }) {
  const playlist = spotifyPlaylist(config.url)
  return <section className="card music-card" aria-labelledby="music-title"><div className="widget-top"><span className="eyebrow"><AudioLines size={16}/> Auf den Ohren</span><SpotifyMark className="spotify-mark"/></div>
    <Popout className="record-popout" buttonClassName="record-object" label="Playlist-Vorschau öffnen" title="Eine Seite von mir" action={playlist ? { label: 'Playlist öffnen', onClick: onOpen } : undefined} trigger={<>
      <span className="vinyl-disc" aria-hidden="true"><span><AudioLines size={20}/></span></span>
      <span className="record-sleeve">{config.cover ? <img src={assetUrl(config.cover.src)} alt={config.cover.alt} width="160" height="160" loading="lazy"/> : <span className="album-art" aria-hidden="true"><span className="album-art-title">A SIDE<br/>OF ME<span>01</span></span><span className="album-star">✳</span><span className="album-art-bottom">MUSIC IS A GOOD PLACE.</span></span>}</span>
      <span className="record-sticker" aria-hidden="true">{playlist ? 'REINHÖREN ↗' : 'PLAYLIST FOLGT'}</span>
    </>}>
      <><div className="popout-icon"><AudioLines size={24}/></div><h3>{config.title}</h3><p>{playlist ? config.note : 'Hier zieht bald meine Lieblingsplaylist ein. Bis dahin ist das Cover ein Platzhalter – und es bleibt still.'}</p></>
    </Popout>
    <div className="playlist-copy"><h2 id="music-title">{config.title}</h2>{playlist && <p>{config.note}</p>}</div>
    <div className="music-bottom"><span className="record-side">SIDE A</span><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/><i/></span></div>
  </section>
}

export function MusicDetail({ config }: { config: PortfolioConfig['spotify'] }) {
  const playlist = spotifyPlaylist(config.url)
  return <div className="standard-detail"><p className="eyebrow"><AudioLines size={16}/> Mein Soundtrack</p><h3>{config.title}</h3><p>{config.note}</p>{playlist ? <><iframe className="spotify-embed" src={playlist.embed} title={`Spotify-Playlist: ${config.title}`} width="100%" height="352" allow="encrypted-media; fullscreen; picture-in-picture" loading="lazy"/><p className="small-note">Falls der Player nicht lädt, kannst du die Playlist direkt auf Spotify öffnen.</p><ExternalLink href={playlist.url} className="button primary">Auf Spotify öffnen</ExternalLink></> : <div className="honest-empty"><ImagePlus size={24}/><p>Meine Playlist folgt noch. Bis dahin bleibt es hier bewusst still.</p></div>}</div>
}

export function RunningWidget({ config, onOpen }: { config: PortfolioConfig['running']; onOpen: () => void }) {
  return <section className="card running-card" aria-labelledby="running-title"><div className="running-copy"><span className="eyebrow"><Footprints size={16}/> Draußen sein</span><h2 id="running-title">{config.title}</h2><p>{config.note}</p><button className="text-button" onClick={onOpen}>Ein paar Schritte raus <ArrowRight size={15}/></button></div><div className="route-art"><span className="route-label" aria-hidden="true">OFFLINE IS A<br/>GOOD PLACE.</span><RouteDrawing/><span className="route-pin" aria-hidden="true"><Footprints size={18}/></span></div></section>
}

export function RunningDetail({ config }: { config: PortfolioConfig['running'] }) {
  return <div className="standard-detail running-detail"><p className="eyebrow"><Footprints size={16}/> Laufen</p><h3>{config.title}</h3><p>{config.note}</p><figure><RouteDrawing/><figcaption>Ein abstraktes Motiv, keine aufgezeichnete Strecke.</figcaption></figure><div className="contribution-grid"><section><h4>Meine Lieblingsstrecke</h4><p className={config.routeName ? '' : 'placeholder-copy'}>{config.routeName ?? 'Die ergänze ich hier noch.'}</p></section><section><h4>Worauf ich hinlaufe</h4><p className={config.goal ? '' : 'placeholder-copy'}>{config.goal ?? 'Hier ist Platz für mein nächstes persönliches Laufziel.'}</p></section></div></div>
}

export function BoulderWidget({ onOpen }: { onOpen: () => void }) {
  const [chalkCue, setChalkCue] = useState(0)
  return <section className="card boulder-card" aria-labelledby="boulder-title" onPointerEnter={(event) => { if (event.pointerType !== 'touch') setChalkCue(value => value + 1) }} onFocus={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setChalkCue(value => value + 1) }}><div className="widget-top"><span className="eyebrow"><Sparkles size={15}/> Kopf & Hände</span></div><div className="boulder-heading"><h2 id="boulder-title">Noch ein<br/>Versuch.</h2><span className="boulder-number" aria-hidden="true">01</span></div><div className="boulder-scene"><button className="boulder-preview-button" onClick={onOpen} aria-label="Boulder-Problem vergrößern und spielen"><BoulderPreview/><span className="board-open-hint"><Play size={12} fill="currentColor"/> Losklettern</span></button><div className="boulder-avatar"><ChalkClimber cue={chalkCue}/></div></div><div className="boulder-bottom"><button className="round-link" onClick={onOpen} aria-label="Boulder-Minispiel starten"><ArrowUpRight size={18}/></button></div></section>
}
