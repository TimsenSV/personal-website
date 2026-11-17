import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { ArrowUpRight, ChevronDown, Disc3, X } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { assetUrl } from '../lib/links'
import { SpotifyMark } from './Icons'
import { MusicDetail } from './Widgets'
import { Window } from './Window'

type Props = {
  config: PortfolioConfig['spotify']
  minimized: boolean
  trigger: RefObject<HTMLButtonElement | null>
  onRestore: () => void
  onPrivacy: () => void
  onClose: () => void
  onStop: () => void
}

export function PlaylistWindow({ config, minimized, trigger, onRestore, onPrivacy, onClose, onStop }: Props) {
  const [revealed, setRevealed] = useState(false)
  const shell = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLButtonElement>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const panelId = useId()
  useEffect(() => () => clearTimeout(leaveTimer.current), [minimized])

  useEffect(() => {
    if (!minimized || !revealed) return
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !shell.current?.contains(event.target)) setRevealed(false)
    }
    document.addEventListener('pointerdown', dismissOutside)
    return () => document.removeEventListener('pointerdown', dismissOutside)
  }, [minimized, revealed])

  const notchBar = <div className="notch-bar">
    <button ref={handle} type="button" className="notch-handle" aria-label="Playlist controls" aria-expanded={revealed} aria-controls={panelId}
      onClick={() => setRevealed(open => !open)}>
      {config.cover ? <img src={assetUrl(config.cover.src)} width="30" height="30" alt=""/> : <Disc3 size={26}/>}
      <span>{config.title}</span><SpotifyMark className="notch-spotify"/><ChevronDown className="notch-chevron" size={14}/>
    </button>
    {revealed && <div className="notch-actions">
      <button type="button" onClick={onRestore} aria-label="Open full playlist" title="Open full playlist"><ArrowUpRight size={18}/></button>
      <button type="button" onClick={onStop} aria-label="Stop and close player" title="Stop and close player"><X size={17}/></button>
    </div>}
  </div>

  return <div className="playlist-shell" ref={shell}
    onPointerEnter={event => {
      clearTimeout(leaveTimer.current)
      if (minimized && event.pointerType === 'mouse') setRevealed(true)
    }}
    onPointerLeave={event => {
      if (!minimized || event.pointerType !== 'mouse') return
      clearTimeout(leaveTimer.current)
      leaveTimer.current = setTimeout(() => {
        if (shell.current?.querySelector('dialog:hover')) return
        if (!shell.current?.contains(document.activeElement)) setRevealed(false)
        else if (document.activeElement instanceof HTMLIFrameElement) {
          handle.current?.focus({ preventScroll: true })
          setRevealed(false)
        }
      }, 150)
    }}
    onBlur={event => {
      if (minimized && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setRevealed(false)
    }}
    onKeyDown={event => {
      if (minimized && revealed && event.key === 'Escape') {
        event.preventDefault()
        setRevealed(false)
        handle.current?.focus()
      }
    }}>
    <Window title={minimized ? 'Spotify mini player' : 'On repeat / Spotify'} returnFocus={trigger}
      minimizedHeader={minimized ? notchBar : undefined}
      variant={minimized ? `playlist-notch${revealed ? ' is-open' : ''}` : 'playlist-window'}
      onClose={() => { setRevealed(false); onClose() }}>
      <div id={panelId} inert={minimized && !revealed}>
        <MusicDetail config={config} onPrivacy={onPrivacy}/>
      </div>
    </Window>
  </div>
}
