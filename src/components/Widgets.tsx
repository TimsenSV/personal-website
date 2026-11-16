import { ArrowRight, ArrowUpRight, AudioLines, Camera, Code2, Footprints, GitBranch, Github, ImagePlus, Linkedin, Play, Sparkles } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { assetUrl, externalUrl, githubProfile, spotifyPlaylist } from '../lib/links'
import { useGitHubActivity } from '../hooks/useGitHubActivity'
import { BoulderPreview } from './BoulderGame'
import { ExternalLink } from './ExternalLink'
import { RouteDrawing, SpotifyMark } from './Icons'

export function IntroWidget({ profile }: { profile: PortfolioConfig['profile'] }) {
  return <section className="card intro-card" aria-labelledby="intro-title">
    <div className="intro-top"><span className="eyebrow">Ein kleiner Einblick</span><span className="intro-spark" aria-hidden="true">✳</span></div>
    <div className="portrait-row">{profile.portrait ? <img className="portrait" src={assetUrl(profile.portrait.src)} alt={profile.portrait.alt} width="66" height="78"/> : <span className="portrait-placeholder" role="img" aria-label="Platzhalter für ein echtes Porträt"><Camera size={21} strokeWidth={1.2}/><small>Foto folgt</small></span>}<div><p className="hello">Hi, ich bin {profile.name}.</p><span className="intro-role">{profile.positioning}</span></div></div>
    <h1 id="intro-title">Ideen in Dinge<br/><em>verwandeln.</em></h1>
    <p className="intro-description">{profile.introduction}</p>
    <p className="intro-personal">{profile.personal}</p>
    <div className="current-focus"><span className="focus-dot"/><div><span className="eyebrow">Gerade im Kopf</span><p>{profile.focus}</p></div></div>
    {externalUrl(profile.linkedinUrl) && <div className="linkedin-widget"><Linkedin size={16}/><ExternalLink href={profile.linkedinUrl}>Auf LinkedIn verbinden</ExternalLink></div>}
  </section>
}

export function GithubWidget({ config, onOpen }: { config: PortfolioConfig['github']; onOpen: () => void }) {
  const selected = config.repositories[0]
  const profile = githubProfile(config.username)
  return <section className="card github-card" aria-labelledby="github-title"><div className="widget-top"><span className="eyebrow"><Github size={16}/> Werkbank</span><button className="round-link" onClick={onOpen} aria-label="GitHub und Experimente öffnen"><ArrowUpRight size={18}/></button></div>
    <h2 id="github-title">Was wäre, wenn …</h2><p className="widget-copy">Ideen ausprobieren. Dinge weiterbauen.</p>
    {selected ? <div className="repository-preview"><GitBranch size={17}/><div><strong>{selected.name}</strong><span>{selected.url ? 'Ausgewähltes Repository' : 'Lokales Experiment · dieses Portfolio'}</span></div><Code2 size={19}/></div> : <div className="repository-preview"><Code2 size={20}/><p>Das nächste Experiment bekommt hier seinen Platz.</p></div>}
    <div className="widget-bottom"><span className="status-label"><i className={profile ? 'is-configured' : ''}/>{profile ? 'Öffentliche Aktivität ansehen' : 'GitHub-Profil folgt'}</span>{profile ? <ExternalLink href={profile}>GitHub</ExternalLink> : <span className="small-note">In Arbeit, wie gute Ideen.</span>}</div>
  </section>
}

export function GithubDetail({ config }: { config: PortfolioConfig['github'] }) {
  const { state, retry } = useGitHubActivity(config.username)
  return <div className="standard-detail"><p className="eyebrow"><Github size={16}/> Die Werkbank</p><h3>Von „Was wäre, wenn“<br/><em>zu „Schau mal“.</em></h3><p>Ein Platz für Experimente, kleine Werkzeuge und Dinge, an denen ich weiterdenke.</p>
    <section className="activity-section"><h4>Öffentliche GitHub-Aktivität</h4>
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
    <div className="music-content"><div className="record-sleeve">{config.cover ? <img src={assetUrl(config.cover.src)} alt={config.cover.alt} width="160" height="160" loading="lazy"/> : <div className="album-art" aria-hidden="true"><span className="album-art-title">A SIDE<br/>OF ME.</span><span className="record-groove"/><span className="album-art-bottom">MUSIC IS A GOOD PLACE.</span></div>}</div><div className="playlist-copy"><h2 id="music-title">{config.title}</h2><p>{playlist ? config.note : 'Meine Lieblingsplaylist zieht hier noch ein.'}</p>{playlist ? <button className="play-button" onClick={onOpen} aria-label="Playlist öffnen"><Play size={18} fill="currentColor"/></button> : <span className="playlist-pending">Wird noch aufgelegt.</span>}</div></div>
    <div className="music-bottom"><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/><i/></span><span>{playlist ? 'Ein persönlicher Soundtrack' : 'Noch kein Soundtrack hinterlegt'}</span></div>
  </section>
}

export function MusicDetail({ config }: { config: PortfolioConfig['spotify'] }) {
  const playlist = spotifyPlaylist(config.url)
  return <div className="standard-detail"><p className="eyebrow"><AudioLines size={16}/> Mein Soundtrack</p><h3>{config.title}</h3><p>{config.note}</p>{playlist ? <><iframe className="spotify-embed" src={playlist.embed} title={`Spotify-Playlist: ${config.title}`} width="100%" height="352" allow="encrypted-media; fullscreen; picture-in-picture" loading="lazy"/><p className="small-note">Falls der Player nicht lädt, kannst du die Playlist direkt auf Spotify öffnen.</p><ExternalLink href={playlist.url} className="button primary">Auf Spotify öffnen</ExternalLink></> : <div className="honest-empty"><ImagePlus size={24}/><p>Meine Playlist folgt noch. Bis dahin bleibt es hier bewusst still.</p></div>}</div>
}

export function RunningWidget({ config, onOpen }: { config: PortfolioConfig['running']; onOpen: () => void }) {
  return <section className="card running-card" aria-labelledby="running-title"><div className="running-copy"><span className="eyebrow"><Footprints size={16}/> Draußen sein</span><h2 id="running-title">{config.title}</h2><p>{config.note}</p><button className="text-button" onClick={onOpen}>Ein paar Schritte raus <ArrowRight size={15}/></button></div><div className="route-art"><RouteDrawing/><span>Eine Linie, keine GPS-Aufzeichnung.</span></div></section>
}

export function RunningDetail({ config }: { config: PortfolioConfig['running'] }) {
  return <div className="standard-detail running-detail"><p className="eyebrow"><Footprints size={16}/> Laufen</p><h3>{config.title}</h3><p>{config.note}</p><figure><RouteDrawing/><figcaption>Ein abstraktes Motiv, keine aufgezeichnete Strecke.</figcaption></figure><div className="contribution-grid"><section><h4>Meine Lieblingsstrecke</h4><p className={config.routeName ? '' : 'placeholder-copy'}>{config.routeName ?? 'Die ergänze ich hier noch.'}</p></section><section><h4>Worauf ich hinlaufe</h4><p className={config.goal ? '' : 'placeholder-copy'}>{config.goal ?? 'Hier ist Platz für mein nächstes persönliches Laufziel.'}</p></section></div></div>
}

export function BoulderWidget({ onOpen }: { onOpen: () => void }) {
  return <section className="card boulder-card" aria-labelledby="boulder-title"><div className="widget-top"><span className="eyebrow"><Sparkles size={15}/> Kopf & Hände</span><span className="tiny-tag">Spielbar</span></div><h2 id="boulder-title">Noch ein Versuch.</h2><p className="widget-copy">Ein kleines Boulder-Problem für zwischendurch.</p><button className="boulder-preview-button" onClick={onOpen} aria-label="Boulder-Problem vergrößern und spielen"><BoulderPreview/><span className="board-open-hint"><ArrowUpRight size={17}/> Route öffnen</span></button><div className="boulder-bottom"><span>7 Züge. Dein Weg nach oben.</span><button className="round-link" onClick={onOpen} aria-label="Boulder-Minispiel starten"><ArrowUpRight size={18}/></button></div></section>
}
