import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, RotateCcw } from 'lucide-react'
import { createGame, holds, isReachable, MAX_MOVES, moveTo } from '../game/boulder'

export function BoulderPreview() {
  return <svg className="boulder-preview" viewBox="0 0 300 280" fill="none" aria-hidden="true">
    <defs><pattern id="wall-bolts" width="27" height="27" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1" fill="#bac4dc" opacity=".5"/></pattern></defs>
    <path d="M22 0h256v280H22z" fill="url(#wall-bolts)"/>
    {[
      ...holds.map(hold => [20 + hold.x * 2.6, 8 + hold.y * 2.65, hold.rotation, 'blue']),
      [51, 63, 20, 'sand'], [251, 119, -20, 'sand'], [164, 244, 10, 'sand'],
    ].map(([x, y, rotation, color], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${rotation})`}><path d="M-17 3c-3-9 2-15 12-15S13-9 17-1s-8 15-17 13S-14 10-17 3Z" fill={color === 'blue' ? '#3159f5' : '#dce3f0'}/><path d="M-11-2c4-5 13-5 18-1" stroke={color === 'blue' ? '#94adff' : '#f4f7ff'} strokeWidth="3" strokeLinecap="round"/></g>)}
    <circle cx="72" cy="246" r="25" stroke="#3159f5" strokeDasharray="3 4" opacity=".5"/>
    <text x="103" y="271" fill="#60646f" fontSize="10" letterSpacing="2">START</text><text x="136" y="32" fill="#60646f" fontSize="10" letterSpacing="2">TOP</text>
  </svg>
}

export function BoulderGame() {
  const [game, setGame] = useState(createGame)
  const restartRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (game.status !== 'playing') restartRef.current?.focus({ preventScroll: true })
  }, [game.status])
  const current = game.path[game.path.length - 1]
  const points = game.path.map((id) => holds.find((hold) => hold.id === id)!).map((hold) => `${hold.x},${hold.y}`).join(' ')
  return <div className="boulder-game">
    <div className="game-intro"><div className="game-heading"><p className="eyebrow">Kleine Pause / Boulder No. 01</p><h3>Erst denken.<br/><em>Dann greifen.</em></h3><p>Finde deinen Weg zum Top. Du hast {MAX_MOVES} Züge — und nicht jeder Griff führt nach oben.</p></div>
      <details className="game-instructions"><summary>So geht’s</summary><p>Klicke oder tippe auf einen Griff. Umrandete Griffe sind in Reichweite. Mit <kbd>Tab</kbd> und <kbd>Enter</kbd> geht es auch per Tastatur. Jeder Wechsel kostet einen Zug, auch der Rückweg.</p></details>
      <div className="game-controls">
      <div className="energy-meter" aria-label={`${game.remaining} von ${MAX_MOVES} Zügen übrig`}><span className="eyebrow">Noch Kraft für</span><div aria-hidden="true">{Array.from({ length: MAX_MOVES }, (_, i) => <span key={i} className={i < game.remaining ? 'energy-full' : ''}/>)}</div><strong>{game.remaining} {game.remaining === 1 ? 'Zug' : 'Züge'}</strong></div>
      <p className={`game-status status-${game.status}`} role="status" aria-live="polite" aria-atomic="true">{game.status === 'won' && <Check size={20}/>} {game.message}</p>
      <button ref={restartRef} className="button secondary" onClick={() => setGame(createGame())}><RotateCcw size={16}/> Neu starten</button>
      </div>
    </div>
    <div className={`game-board ${game.status !== 'playing' ? 'game-finished' : ''}`} role="group" aria-label="Boulderwand mit acht Griffen">
      <div className="board-label"><span>Die blaue Route</span><ArrowUpRight size={14}/></div>
      <svg className="game-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" stroke="#3159f5" strokeWidth=".65" strokeDasharray="1.5 1.4" opacity=".5"/></svg>
      {holds.map((hold) => {
        const reachable = isReachable(current, hold.id) && game.status === 'playing'
        const here = current === hold.id
        return <button key={hold.id} className={`hold ${here ? 'is-current' : ''} ${reachable ? 'is-reachable' : ''} ${hold.id === 'top' ? 'is-top' : ''}`}
          style={{ left: `${hold.x}%`, top: `${hold.y}%` }}
          onClick={() => setGame((state) => moveTo(state, hold.id))}
          aria-label={`${hold.label}${here ? ', du bist hier' : reachable ? ', erreichbar' : ', außer Reichweite'}`}
          aria-pressed={here} disabled={game.status !== 'playing'}>
          <svg viewBox="0 0 50 50" style={{ transform: `rotate(${hold.rotation}deg)` }} aria-hidden="true"><path d="M7 28C3 15 11 9 23 9s17 5 21 14-10 20-21 17S10 38 7 28Z"/><path d="M14 21c6-6 16-5 21-1" className="hold-ridge"/></svg>
          {hold.id === 'top' && <span className="hold-label">TOP</span>}{hold.id === 'start' && <span className="hold-label">START</span>}
        </button>
      })}
    </div>
  </div>
}
