import { memo, useEffect, useReducer, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Trophy } from 'lucide-react'
import { ChalkClimber } from './ChalkClimber'
import { ClimbingTim } from './ClimbingTim'
import { holds } from '../game/boulder'
import { climbReducer, createClimb, formatHeight, PERFECT_END, PERFECT_START, readBest, routeRow, saveBest, type ClimbState, type HoldKind, type Side } from '../game/climber'

export function BoulderPreview() {
  return <svg className="boulder-preview" viewBox="0 0 300 280" fill="none" aria-hidden="true">
    <defs><pattern id="wall-bolts" width="27" height="27" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1" fill="#bac4dc" opacity=".5"/></pattern></defs>
    <path d="M22 0h256v280H22z" fill="url(#wall-bolts)"/>
    <polyline className="boulder-preview-route" points={holds.slice(0, 3).map(hold => `${20 + hold.x * 2.6},${8 + hold.y * 2.65}`).join(' ')} stroke="#3159f5" strokeWidth="2" strokeDasharray="4 5"/>
    {[
      ...holds.map(hold => [20 + hold.x * 2.6, 8 + hold.y * 2.65, hold.rotation, 'blue']),
      [51, 63, 20, 'sand'], [251, 119, -20, 'sand'], [164, 244, 10, 'sand'],
    ].map(([x, y, rotation, color], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${rotation})`}><path d="M-17 3c-3-9 2-15 12-15S13-9 17-1s-8 15-17 13S-14 10-17 3Z" fill={color === 'blue' ? '#3159f5' : '#dce3f0'}/><path d="M-11-2c4-5 13-5 18-1" stroke={color === 'blue' ? '#94adff' : '#f4f7ff'} strokeWidth="3" strokeLinecap="round"/></g>)}
    <circle cx="72" cy="246" r="25" stroke="#3159f5" strokeDasharray="3 4" opacity=".5"/>
    <text x="103" y="271" fill="#60646f" fontSize="10" letterSpacing="2">START</text><text x="136" y="32" fill="#60646f" fontSize="10" letterSpacing="2">∞</text>
  </svg>
}

const holdNames: Record<HoldKind, string> = { normal: 'normaler Griff', jug: 'großer Griff', crimp: 'bröseliger Griff' }
const laneX = (side: Side | null) => side === 'left' ? 145 : side === 'right' ? 295 : 220

function HoldShape({ kind }: { kind: HoldKind }) {
  return <g className={`climb-hold hold-${kind}`}>
    {kind === 'jug' ? <><path d="M-28-3Q-26-20 0-17Q29-17 28 2Q24 18-2 15Q-30 15-28-3Z"/><path className="climb-hold-ridge" d="M-17-3Q0-15 18-2"/></> : kind === 'crimp' ? <><path d="M-20-4L-12-11 7-9 20-4 16 9-13 8Z"/><path className="climb-hold-ridge" d="M-12-2L-3-4 3 0 12-2"/><path className="climb-crack" d="M0-8L-4-1 2 3-1 9"/></> : <><path d="M-22 1Q-25-14-3-14Q19-16 23-1Q23 15 0 13Q-20 14-22 1Z"/><path className="climb-hold-ridge" d="M-13-3Q0-11 13-3"/></>}
    <circle r="2" cy="4" fill="#18223c" opacity=".25"/>
  </g>
}

const ClimbWall = memo(function ClimbWall({ seed, step, side, kind, status, event, lastMove, tired, record, height }: Pick<ClimbState, 'seed' | 'step' | 'side' | 'kind' | 'status' | 'event' | 'lastMove' | 'height'> & { tired: boolean; record: number }) {
  const rows = Array.from({ length: 7 }, (_, i) => step + i - 2).filter(index => index >= 0)
  const recordY = 375 - (record - height) * 50
  return <svg className="climb-wall" viewBox="0 0 440 560" fill="none" aria-hidden="true">
    <defs><pattern id="climb-bolts" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.1" fill="currentColor" opacity=".2"/></pattern></defs>
    <rect width="440" height="560" fill="url(#climb-bolts)"/>
    <path d="M53 0L16 140 70 280 38 440M402 0L425 175 375 300 417 465" stroke="currentColor" opacity=".08"/>
    {rows.map(index => <g key={`${seed}-${index}`} className="climb-wall-row" style={{ transform: `translateY(${375 - (index - step) * 100}px)` }}>
      {index === 0 ? <g transform="translate(220 0)"><HoldShape kind="jug"/></g> : routeRow(seed, index).map(hold => <g key={hold.side} transform={`translate(${laneX(hold.side)} 0)`} opacity={index < step || (index === step && hold.side !== side) ? .22 : index > step + 1 ? .52 : 1}>
        {index === step + 1 && <><circle className="climb-next-ring" r="34"/><text className="climb-next-arrow" x={hold.side === 'left' ? -51 : 51} y="5">{hold.side === 'left' ? '←' : '→'}</text></>}
        <HoldShape kind={hold.kind}/>
      </g>)}
    </g>)}
    {record > 0 && recordY > 15 && recordY < 520 && <g className="climb-record-line" style={{ transform: `translateY(${recordY}px)` }}><path d="M16 0H424"/><rect x="10" y="-22" width="113" height="20" rx="5"/><text x="17" y="-8">BESTE MARKE · {formatHeight(record)} m</text></g>}
    {step < 3 && <g className="climb-mat" style={{ transform: `translateY(${510 + step * 100}px)` }}><rect x="65" width="310" height="36" rx="8" fill="#3254ed"/><path d="M220 0V36M72 9H368" stroke="#6480ff" strokeWidth="2"/><text x="220" y="25">NO SHOES ON THE MAT. OOPS.</text></g>}
    <g className="climb-tim-position" style={{ transform: `translate(${laneX(side) - 40}px, 373px)` }}>
      <g key={`${event}-${status}`} className={`climb-tim-action ${status === 'fallen' ? 'is-falling' : lastMove === 'slip' ? 'is-slipping' : step > 0 ? 'is-reaching' : ''}`}>
        <g className={tired ? 'climb-shivering' : ''}><g transform="scale(2)"><ClimbingTim pose={lastMove === 'slip' ? 'slip' : tired ? 'reach' : 'hang'}/></g></g>
        {step > 0 && status !== 'fallen' && <g className="climb-chalk" fill="#fff" stroke="#c6d1e7" strokeWidth=".5"><rect x="3" y="-5" width="6" height="6"/><rect x="61" y="-8" width="7" height="7"/><rect x="-6" y="9" width="4" height="4"/><rect x="74" y="6" width="4" height="4"/></g>}
      </g>
    </g>
    {kind === 'crimp' && status === 'playing' && <g key={event} className="climb-crumbs" fill="#e87344" style={{ transform: `translate(${laneX(side)}px,375px)` }}><rect x="-21" y="8" width="3" height="4"/><rect x="18" y="10" width="4" height="3"/></g>}
  </svg>
})

export function BoulderGame() {
  const [game, dispatch] = useReducer(climbReducer, undefined, () => createClimb())
  const [record, setRecord] = useState(readBest)
  const best = Math.max(record, game.height)
  const boardRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)
  const progress = Math.min(1, game.elapsed / game.budget)
  const next = routeRow(game.seed, game.step + 1)
  const direction = next.length > 1 ? 'links oder rechts' : next[0].side === 'left' ? 'links' : 'rechts'
  const isPerfect = progress >= PERFECT_START && progress <= PERFECT_END
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
  function keyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const key = event.key.toLowerCase()
    if (active && ['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
      event.preventDefault()
      if (!event.repeat) dispatch({ type: 'reach', side: key === 'arrowleft' || key === 'a' ? 'left' : 'right' })
    } else if (active && (key === 'p' || key === ' ' || key === 'tab')) {
      event.preventDefault()
      if (!event.repeat) dispatch({ type: 'pause' })
    }
  }

  return <div ref={gameRef} className={`climb-game is-${game.status}`} onKeyDown={keyDown} onBlur={event => {
    if (active && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) dispatch({ type: 'pause' })
  }}>
    <header className="climb-hud">
      <div className="climb-height"><span>HÖHE</span><strong>{formatHeight(game.height)}<small> m</small></strong></div>
      <div className="climb-best"><Trophy size={14}/><span>BESTE MARKE<strong>{formatHeight(best)} m</strong></span></div>
      <button className="climb-pause" onClick={() => dispatch({ type: 'pause' })} disabled={!active} aria-label="Spiel pausieren"><Pause size={18}/></button>
    </header>
    <div className="climb-stage" data-world={Math.floor(game.height / 30) % 3} ref={boardRef} tabIndex={0} role="group" aria-label="Endless Climber: Kletterwand" aria-describedby="climb-next">
      <ClimbWall seed={game.seed} step={game.step} side={game.side} kind={game.kind} status={game.status} event={game.event} lastMove={game.lastMove} tired={active && progress > .78} record={record} height={game.height}/>
      <div className="climb-live-info" aria-hidden="true">
        <span className={`climb-combo ${game.combo >= 3 ? 'in-flow' : ''}`}>{game.combo > 1 ? <><b>{game.combo}×</b> FLOW</> : 'JUST ONE MORE HOLD.'}</span>
        <span className={`climb-save ${!game.saves ? 'is-used' : ''}`}><i/>{game.saves ? '1 Rettung' : 'Letzte Chance'}</span>
      </div>
      {active && <div key={game.event} className={`climb-feedback ${game.lastMove === 'slip' ? 'is-warning' : ''}`} aria-hidden="true">{game.step === 0 && game.lastMove === 'start' ? 'Links geht’s los.' : game.feedback}{newRecord && game.step > 1 && <small>Neue Bestmarke ↗</small>}</div>}
      <div className="climb-inputs" inert={!active}>
        <button className="climb-input input-left" aria-label="Links greifen" aria-keyshortcuts="ArrowLeft A" disabled={!active} onClick={() => dispatch({ type: 'reach', side: 'left' })}><span><ArrowLeft size={22}/><span>LINKS</span></span></button>
        <button className="climb-input input-right" aria-label="Rechts greifen" aria-keyshortcuts="ArrowRight D" disabled={!active} onClick={() => dispatch({ type: 'reach', side: 'right' })}><span><span>RECHTS</span><ArrowRight size={22}/></span></button>
      </div>
      {game.status !== 'playing' && <div className={`climb-overlay overlay-${game.status}`}>
        <div className="climb-overlay-card">
          {game.status === 'ready' ? <>
            <div aria-hidden="true" inert><ChalkClimber compact cue={1}/></div><span className="climb-kicker">ENDLESS CLIMBER</span><h3>Noch ein<br/><em>Griff.</em></h3>
            <p>Wie weit kommst du,<br/>bevor die Arme zumachen?</p>
            <div className="climb-how"><span><kbd>←</kbd><kbd>→</kbd> oder links / rechts tippen</span><span>Kurz halten, dann zum umkreisten Griff.</span><span>In der blauen Zone? Saubere Combo.</span></div>
            <button className="climb-primary" onClick={start}><Play size={17} fill="currentColor"/> Losklettern</button>
          </> : game.status === 'paused' ? <>
            <span className="climb-kicker">KURZ DURCHATMEN</span><h3>Arme<br/><em>ausschütteln.</em></h3><p>Dein Run wartet hier auf dich.</p>
            <button ref={primaryRef} className="climb-primary" onClick={resume}><Play size={17} fill="currentColor"/> Weiterklettern</button>
            <button className="climb-secondary" onClick={start}><RotateCcw size={14}/> Von vorne</button>
          </> : <>
            <span className="climb-kicker">{newRecord ? 'NEUE BESTMARKE' : 'DIE MATTE HAT DICH'}</span><h3>{formatHeight(game.height)}<em> m.</em></h3><p>{game.feedback}</p>
            <div className="climb-run-stats"><span><strong>{game.step}</strong> Griffe</span><span><strong>{game.maxCombo}×</strong> beste Combo</span></div>
            <button ref={primaryRef} className="climb-primary" onClick={start}><RotateCcw size={17}/> Noch ein Versuch</button>
            <span className="climb-local-note">Dein Rekord bleibt in diesem Browser.</span>
          </>}
          {game.status !== 'fallen' && <div className="climb-legend"><span><i className="legend-normal"/>Normal</span><span><i className="legend-jug"/>Mehr Zeit</span><span><i className="legend-crimp"/>Schnell weiter</span></div>}
        </div>
      </div>}
    </div>
    <div className={`climb-rhythm ${isPerfect && active ? 'is-perfect' : ''}`}>
      <div className="climb-rhythm-label"><span>{!active ? 'Dein Rhythmus' : progress < PERFECT_START ? 'Kurz halten …' : isPerfect ? 'Jetzt sauber greifen!' : progress > .8 ? 'Nicht loslassen, Tim.' : 'Noch hält’s.'}</span><span>{active ? game.kind === 'jug' ? 'GROSSER GRIFF' : game.kind === 'crimp' ? 'BRÖSELIG' : 'NORMALER GRIFF' : '← → / A D · P Pause'}</span></div>
      <div className="climb-timing-track" aria-hidden="true"><span className="climb-perfect-zone" style={{ left: `${PERFECT_START * 100}%`, width: `${(PERFECT_END - PERFECT_START) * 100}%` }}/><span className="climb-timing-cursor" style={{ '--progress': progress } as CSSProperties}/></div>
    </div>
    <span id="climb-next" className="sr-only" role="status" aria-live="polite" aria-atomic="true">{game.status === 'fallen' ? `${formatHeight(game.height)} Meter. ${game.feedback}` : game.status === 'paused' ? 'Spiel pausiert.' : `Nächster Griff: ${direction}. ${next.map(hold => holdNames[hold.kind]).join(' oder ')}. ${game.feedback}`}</span>
  </div>
}
