import { memo, useEffect, useReducer, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, CornerDownLeft, Hand, Pause, Play, RotateCcw, Trophy } from 'lucide-react'
import { ClimbResult } from './ClimbResult'
import { ClimbPoster } from './ClimbPoster'
import { EnergyBar, PixelType } from './PixelType'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ClimbingTim } from './ClimbingTim'
import { ClimbBackdrop } from './ClimbBackdrop'
import { climbMotion, laneX, type ClimbMotion } from '../game/climbMotion'
import { climbReducer, createClimb, formatHeight, CLIMB_NAME, isInTimingZone, isThreeLaneRow, readBest, routeRow, saveBest, zoneBounds, type ClimbState, type HoldKind, type Side, type TimingZone } from '../game/climber'

const holdNames: Record<HoldKind, string> = { normal: 'regular hold', jug: 'jug hold', crimp: 'small hold', loose: 'cracked hold — breaks if grabbed' }
const sideNames: Record<Side, string> = { left: 'left', center: 'middle', right: 'right' }
function ClimbTimingArc({ progress, zone, x, y }: { progress: number; zone: TimingZone; x: number; y: number }) {
  const { start } = zoneBounds(zone)
  const ready = isInTimingZone(progress, zone)
  const angle = Math.PI * progress
  const radius = 58
  const arc = `M ${-radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0`

  // Anchor the arc to the same moving palm as the wall sprite.
  return <svg className={`climb-timing-arc ${ready ? 'is-perfect' : ''} ${progress > .8 ? 'is-late' : ''}`} viewBox="0 0 440 560" fill="none" aria-hidden="true">
    <g className="climb-tim-position" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <g transform="translate(0 6)">
        <path className="climb-arc-backing" d={arc}/>
        <path className="climb-arc-track" d={arc}/>
        <path className={`climb-arc-zone zone-${zone.change}`} d={arc} pathLength="100" strokeDasharray={`${zone.width * 100} 100`} strokeDashoffset={-start * 100}/>
        <circle className="climb-arc-cursor" cx={-radius * Math.cos(angle)} cy={-radius * Math.sin(angle)} r="5.5"/>
      </g>
    </g>
  </svg>
}

function HoldShape({ kind }: { kind: HoldKind }) {
  if (kind === 'loose') return <g className="climb-hold hold-loose">
    <path className="loose-half loose-half-left" d="M-27-1L-18-15-3-13 2-5-7 2-1 7-5 15-20 12Z"/>
    <path className="loose-half loose-half-right" d="M3-14L20-12 28 2 18 15 0 13 5 6-1 1 8-5Z"/>
    <path className="loose-crack" d="M0-13L5-5-4 1 2 7-2 14"/>
    <path className="climb-hold-ridge" d="M-19-5L-11-8M13-6L19-4"/>
  </g>
  return <g className={`climb-hold hold-${kind}`}>
    {kind === 'jug' ? <><path d="M-28-3Q-26-20 0-17Q29-17 28 2Q24 18-2 15Q-30 15-28-3Z"/><path className="climb-hold-ridge" d="M-17-3Q0-15 18-2"/></> : kind === 'crimp' ? <><path d="M-20-4L-12-11 7-9 20-4 16 9-13 8Z"/><path className="climb-hold-ridge" d="M-12-2L-3-4 3 0 12-2"/></> : <><path d="M-22 1Q-25-14-3-14Q19-16 23-1Q23 15 0 13Q-20 14-22 1Z"/><path className="climb-hold-ridge" d="M-13-3Q0-11 13-3"/></>}
    <circle r="2" cy="4" fill="#18223c" opacity=".25"/>
  </g>
}

type WallProps = Pick<ClimbState, 'seed' | 'step' | 'side' | 'kind' | 'status' | 'event' | 'height' | 'advancedFrom' | 'reason' | 'boost'>
  & ClimbMotion & { tired: boolean; record: number }

const ClimbWall = memo(function ClimbWall({ seed, step, side, kind, status, event, tired, record, height, advancedFrom, reason, boost, camera, x, y, pose, facing, chalk }: WallProps) {
  const rows = Array.from({ length: 7 }, (_, i) => Math.floor(camera) + i - 2).filter(index => index >= 0)
  const recordY = 375 - (record - height) * 50
  const broken = reason === 'broken'
  const nextRow = boost ? boost.step : step + 1
  return <svg className="climb-wall" viewBox="0 0 440 560" fill="none" aria-hidden="true">
    <defs><pattern id="climb-bolts" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.1" fill="currentColor" opacity=".2"/></pattern></defs>
    <rect width="440" height="560" fill="url(#climb-bolts)"/>
    <path d="M53 0L16 140 70 280 38 440M402 0L425 175 375 300 417 465" stroke="currentColor" opacity=".08"/>
    {rows.map(index => <g key={`${seed}-${index}`} className="climb-wall-row" style={{ transform: `translateY(${375 - (index - camera) * 100}px)` }}>
      {index === 0 ? <g transform="translate(220 0)"><HoldShape kind="jug"/></g> : routeRow(seed, index, advancedFrom).map(hold => <g key={hold.side} className={broken && index === step + 1 && hold.side === side ? 'is-broken' : undefined} transform={`translate(${laneX(hold.side, isThreeLaneRow(index, advancedFrom))} 0)`} opacity={index < step || (index === step && hold.side !== side) ? .22 : index > step + 1 ? .52 : 1}>
        {index === nextRow && (!boost || hold.side === boost.side) && <><circle className="climb-next-ring" r="34"/><text className="climb-next-arrow" x={hold.side === 'left' ? -51 : hold.side === 'right' ? 51 : 0} y={hold.side === 'center' ? hold.powerup ? -61 : -45 : 5}>{hold.side === 'left' ? '←' : hold.side === 'right' ? '→' : '↑'}</text></>}
        <HoldShape kind={hold.kind}/>{hold.powerup && index > step && <EnergyBar/>}
      </g>)}
    </g>)}
    {record > 0 && recordY > 15 && recordY < 520 && <g className="climb-record-line" style={{ transform: `translateY(${recordY}px)` }}><path d="M16 0H424"/><rect x="10" y="-22" width="113" height="20" rx="5"/><text x="17" y="-8">PERSONAL BEST · {formatHeight(record)} m</text></g>}
    {step < 3 && <g className="climb-mat" style={{ transform: `translateY(${510 + camera * 100}px)` }}><rect x="65" width="310" height="36" rx="8" fill="#3254ed"/><path d="M220 0V36M72 9H368" stroke="#6480ff" strokeWidth="2"/><text x="220" y="25">NO SHOES ON THE MAT. OOPS.</text></g>}
    <g className="climb-tim-position" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <g key={event} className={status === 'fallen' ? `climb-tim-action is-falling ${broken ? 'is-breaking' : ''}` : 'climb-tim-action'}>
        <g transform={`scale(${2 * facing} 2) translate(-30 -8)`}>
          {chalk > 0 && <g className="climb-dust" opacity={chalk} fill="#fffcf2" stroke="#b7c4dc" strokeWidth=".6"
            transform={`translate(${-chalk * 6} ${chalk * 9})`}>
            <path d="M9 25h3v3H9zM4 29h2v2H4zM7 34h2v2H7zM14 31h3v3h-3zM1 37h2v2H1z"/>
          </g>}
          <g className={tired ? 'climb-shivering' : undefined}><ClimbingTim pose={pose}/></g>
        </g>
      </g>
    </g>
    {kind === 'crimp' && status === 'playing' && <g key={event} className="climb-crumbs" fill="#e87344" style={{ transform: `translate(${x}px,375px)` }}><rect x="-21" y="8" width="3" height="4"/><rect x="18" y="10" width="4" height="3"/></g>}
  </svg>
})

export function BoulderGame() {
  const reducedMotion = useReducedMotion()
  const [game, dispatch] = useReducer(climbReducer, undefined, () => createClimb())
  const [record, setRecord] = useState(readBest)
  const motion = climbMotion(game, reducedMotion)
  const displayHeight = game.boost ? game.height + (game.boost.height - game.height) * motion.flight : game.height
  const best = Math.max(record, game.height)
  const boardRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)
  const progress = Math.min(1, game.elapsed / game.budget)
  const next = routeRow(game.seed, game.step + 1, game.advancedFrom)
  const threeLanes = isThreeLaneRow(game.step + 1, game.advancedFrom)
  const direction = next.map(hold => sideNames[hold.side]).join(' or ')
  const lives = game.status === 'fallen' ? 0 : game.saves + 1
  const canReach = game.status === 'playing' && !game.boost
  const active = game.status === 'playing'
  const newRecord = game.height > record && game.height > 0

  useEffect(() => {
    if (!active) return
    let frame = 0
    let previous: number | null = null
    let accumulated = 0
    function update(now: number) {
      if (previous !== null) accumulated += now - previous
      previous = now
      // A suspended browser is a pause, never an invisible loss.
      if (accumulated > 500) { dispatch({ type: 'pause' }); return }
      if (accumulated >= 30) { dispatch({ type: 'tick', delta: accumulated }); accumulated = 0 }
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    const pause = () => dispatch({ type: 'pause' })
    const visibility = () => { if (document.hidden) pause() }
    window.addEventListener('blur', pause)
    document.addEventListener('visibilitychange', visibility)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility) }
  }, [active])

  useEffect(() => {
    if (game.height > record) saveBest(game.height)
  }, [game.height, record])

  useEffect(() => {
    if (game.status === 'fallen' || game.status === 'paused') primaryRef.current?.focus({ preventScroll: true })
  }, [game.status])

  function start() {
    setRecord(Math.max(best, readBest()))
    dispatch({ type: 'start', seed: Math.floor(Math.random() * 0x7fffffff) })
    boardRef.current?.focus({ preventScroll: true })
  }
  function resume() {
    dispatch({ type: 'resume' })
    boardRef.current?.focus({ preventScroll: true })
  }
  function reach(side: Side) {
    dispatch({ type: 'reach', side })
    // The middle button disappears at a section boundary; keep keyboard control.
    boardRef.current?.focus({ preventScroll: true })
  }
  function keyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const key = event.key.toLowerCase()
    if ((game.status === 'ready' || game.status === 'fallen') && (key === 'enter' || key === ' ')) {
      event.preventDefault()
      if (!event.repeat) start()
    } else if (active && ['arrowleft', 'arrowright', 'arrowup', 'a', 'd', 'w'].includes(key)) {
      event.preventDefault()
      const side = key === 'arrowleft' || key === 'a' ? 'left' : key === 'arrowright' || key === 'd' ? 'right' : 'center'
      if (!event.repeat && (side !== 'center' || threeLanes)) dispatch({ type: 'reach', side })
    } else if (active && (key === 'p' || key === ' ' || key === 'tab')) {
      event.preventDefault()
      if (!event.repeat) dispatch({ type: 'pause' })
    }
  }

  return <div ref={gameRef} className={`climb-game is-${game.status} ${game.boost ? 'has-boost' : ''}`} onKeyDown={keyDown} onBlur={event => {
    if (active && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) dispatch({ type: 'pause' })
  }}>
    {(active || game.status === 'paused') && <header className="climb-hud">
      <div className="climb-altitude"><div className="climb-height"><span>{game.boost ? 'BOOST ↑' : 'HEIGHT'}</span><strong>{formatHeight(displayHeight)}<small> m</small></strong></div><div className="climb-best"><Trophy size={12}/><span>BEST <strong>{formatHeight(best)} m</strong></span></div></div>
      <div className={`climb-lives ${lives === 1 ? 'last-life' : ''}`} role="img" aria-label={`${lives} of 2 lives`}>
        <span className="climb-life-icons" aria-hidden="true">{[0, 1].map(index => <span key={`${index}-${index < lives}`} className={`climb-life ${index < lives ? 'is-full' : 'is-empty'}`}><Hand size={25} strokeWidth={1.8}/></span>)}</span>
      </div>
      <button className="climb-pause" onClick={() => dispatch({ type: 'pause' })} disabled={!active} aria-label="Pause game"><Pause size={18}/></button>
    </header>}
    <div className="climb-stage" data-world={Math.floor(game.height / 30) % 3} ref={boardRef} tabIndex={0} role="group" aria-label={`${CLIMB_NAME}: Climbing wall`} aria-describedby="climb-next">
      {game.status !== 'ready' && <>
      <ClimbBackdrop key={game.seed} step={motion.camera}/>
      <ClimbWall seed={game.seed} step={game.step} side={game.side} kind={game.kind} status={game.status} event={game.event} tired={active && progress > .78} record={record} height={displayHeight} advancedFrom={game.advancedFrom} reason={game.reason} boost={game.boost} {...motion}/>
      {!game.boost && (active || game.status === 'paused') && <ClimbTimingArc progress={progress} zone={game.zone} x={motion.x} y={motion.y}/>}
      {game.status !== 'fallen' && <>
      <div className="climb-live-info" aria-hidden="true">
        <span className={`climb-combo ${game.combo >= 3 ? 'in-flow' : ''}`}>{game.combo > 1 ? <><b>{game.combo}×</b> FLOW</> : 'JUST ONE MORE HOLD.'}</span>
        {next.some(hold => hold.powerup) && !game.boost && <span className="climb-energy-tip">Energy bar!<small>Clean hit → Dyno-Boost</small></span>}
        {threeLanes && !next.some(hold => hold.powerup) && <span className="climb-route-tip">Cracked holds break.<small>↑ / W for the middle</small></span>}
      </div>
      {active && !game.boost && <div key={game.event} className={`climb-feedback ${game.step === 0 ? 'is-start' : ''} ${game.lastMove === 'slip' ? 'is-warning' : ''}`} aria-hidden="true">{game.step === 0 && game.lastMove === 'start' ? '← / → or tap. Reach when the dot hits blue.' : game.feedback}{game.zone.change !== 'steady' && <small className={`zone-${game.zone.change}`}>{game.zone.change === 'wider' ? 'More room +' : 'Tighter window −'}</small>}{newRecord && game.step > 1 && <small>New personal best ↗</small>}</div>}
      {game.boost && <div className="climb-boost-banner" key={game.event} aria-hidden="true"><PixelType text="DYNO-BOOST"/><span>+{formatHeight(game.boost.height - game.height)} m</span></div>}
      <div className={`climb-inputs ${threeLanes ? 'has-center' : ''}`} inert={!canReach}>
        <button className="climb-input input-left" aria-label="Reach left" aria-keyshortcuts="ArrowLeft A" disabled={!canReach} onClick={() => reach('left')}><span><ArrowLeft size={22}/><span>LEFT</span></span></button>
        {threeLanes && <button className="climb-input input-center" aria-label="Reach middle" aria-keyshortcuts="ArrowUp W" disabled={!canReach} onClick={() => reach('center')}><span><ArrowUp size={22}/><span>MID</span></span></button>}
        <button className="climb-input input-right" aria-label="Reach right" aria-keyshortcuts="ArrowRight D" disabled={!canReach} onClick={() => reach('right')}><span><span>RIGHT</span><ArrowRight size={22}/></span></button>
      </div>
      </>}
      </>}
      {game.status === 'fallen' && <ClimbResult run={game} previousBest={record} restartRef={primaryRef} onRestart={start}/>}
      {(game.status === 'ready' || game.status === 'paused') && <div className={`climb-overlay overlay-${game.status}`}>
        <div className="climb-overlay-card">
          {game.status === 'ready' ? <>
            <ClimbPoster/>
            <button ref={primaryRef} data-game-start className="climb-primary" onClick={start} aria-keyshortcuts="Enter Space"><Play size={17} fill="currentColor" aria-hidden="true"/> Start climbing <kbd className="climb-enter-key" aria-hidden="true"><CornerDownLeft size={15}/></kbd></button>
          </> : <>
            <span className="climb-kicker">TAKE A BREATHER</span><h3>Shake<br/><em>it out.</em></h3><p>Your run will be right here.</p>
            <button ref={primaryRef} className="climb-primary" onClick={resume}><Play size={17} fill="currentColor"/> Keep climbing</button>
            <button className="climb-secondary" onClick={start}><RotateCcw size={14}/> Start over</button>
          </>}
          {game.status === 'paused' && <div className="climb-legend"><span><i className="legend-normal"/>Normal</span><span><i className="legend-jug"/>More time</span><span><i className="legend-crimp"/>Move fast</span>{threeLanes && <span><i className="legend-loose"/>Breaks</span>}</div>}
        </div>
      </div>}
    </div>
    <span id="climb-next" className="sr-only" role="status" aria-live="polite" aria-atomic="true">{game.status === 'ready' ? 'Press Enter or Space to start climbing.' : game.status === 'paused' ? 'Game paused.' : game.boost ? 'Dyno-Boost! Skipping three holds. Timing resumes after landing.' : game.status === 'fallen' ? `${formatHeight(game.height)} metres. ${game.feedback}${newRecord ? ' New personal best.' : ''}` : `Next hold: ${direction}. ${next.map(hold => `${sideNames[hold.side]}: ${holdNames[hold.kind]}${hold.powerup ? ', energy bar — clean hit for Dyno-Boost' : ''}`).join('; ')}. ${threeLanes ? 'Arrow Up or W for the middle. ' : ''}${game.feedback} ${lives} of 2 lives.`}</span>
  </div>
}
