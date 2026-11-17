import { useId, type Ref } from 'react'
import { CornerDownLeft, Flag, RotateCcw, Trophy } from 'lucide-react'
import { formatHeight, type ClimbState } from '../game/climber'
import { ClimbingTim } from './ClimbingTim'

function LandingScene({ record }: { record: boolean }) {
  const pine = useId()
  return <svg className="landing-scene" viewBox="0 0 260 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true" shapeRendering="crispEdges">
    <defs><path id={pine} d="M0 0h2v4h2v3h2v2H4v2h4v3h2v2H6v2h5v3H2v5H0v-5h-9v-3h5v-2h-4v-2h2v-3h4V9h-2V7h2V4h2z"/></defs>
    <path fill="#354373" d="M0 0h260v100H0z"/>
    <path fill="#485684" d="M0 26h260v60H0z"/><path fill="#666894" d="M0 40h260v50H0z"/>
    <path fill="#dfb4aa" d="M0 57h260v20H0z"/>
    <g transform="translate(0 7)">
    <path fill="#fff0c7" d="M196 10h6v2h3v3h2v6h-2v3h-3v2h-6v-2h-3v-3h-2v-6h2v-3h3z"/>
    <path fill="#485684" d="M193 20h8v1h-8zm6 3h8v1h-8z"/>
    </g>
    <path fill="#e8d9ca" d="M22 10h1v1h-1zm38 7h2v1h-2zm25-11h1v2h-1zm67 8h2v1h-2zm70-9h1v1h-1zM18 36h15v1H18zm4-2h9v1h-9zm141-4h17v1h-17z"/>
    <path fill="#777898" d="M0 49h9v-3h5v-4h4v-4h3v-3h3v-3h3v4h4v5h4v4h4v4h7v3h7v-3h7v-4h4v-3h3v-4h3v-4h3v-4h3v4h4v4h4v4h5v5h6v4h7v4h11v4h10v4h9v-2h11v-4h6v-4h5v-4h4v-4h3v-4h3v-3h3v3h4v4h4v4h5v4h4v3h6v-5h4v-5h4v-3h3v-3h2v3h3v4h4v4h5v5h5v3h8v4h9v-4h10v-3h8v32H0z"/>
    <path fill="#c8b1b5" d="M15 42h3v-4h3v-3h3v-3h3v4h4v5h3v3h-5v-3h-3v-3h-3v4h-3v2h-5zM65 41h2v-3h3v-4h3v-4h3v4h4v4h3v4h-4v-2h-3v-4h-2v4h-4v2h-5z"/>
    <path fill="#475576" d="M0 57l20-9 18 9 18 2 14-7 22 9 21 3 16 5 20-3 16-11 14-4 16 7 18-9 15-2 17 8 15-4v46H0z"/>
    <path fill="#293852" d="M0 62l26-5 28 8 30 1 33 10 30-1 35-10 33-3 18-8 27 5v41H0z"/>
    <g fill="#202c46">{[[6,48,1.2],[18,55,.8],[28,56,.95],[40,63,.5],[218,60,.7],[231,53,1],[247,46,1.3],[257,54,.85]].map(([x,y,s]) => <use key={x} href={'#' + pine} transform={`translate(${x} ${y}) scale(${s})`}/>)}</g>
    <path fill="#17243b" d="M0 74h26v-2h22v2h22v3h21v2h64v-2h25v-3h27v-4h20v-2h33v32H0z"/>
    <path fill="#344459" d="M23 86h14v1H23zm23 6h7v1h-7zm138-8h13v1h-13zm-4 9h6v1h-6z"/>
    <g transform="translate(82 77)">
      <path fill="#101b30" d="M0 9h95v4h-3v2H4v-2H0z"/>
      <path fill="#24438e" d="M0 4h91v6H1z"/><path fill="#719bf1" d="M6 0h80l5 4H0z"/>
      <path fill="#4364b4" d="M6 1h79l3 2H3z"/><path fill="#9cbafa" d="M44 0h2v4h-2z"/>
      <path fill="#b0bcd2" d="M4 7h3v2H4zm78 0h4v2h-4z"/>
    </g>
    <g transform="translate(108 25)"><g className="landing-tim"><ClimbingTim pose={record ? 'hero' : 'land'}/></g></g>
    <path className="landing-chalk" fill="#f6e2bd" d="M99 76h4v2h-4zm-4-4h2v2h-2zm54 4h4v2h-4zm6-6h2v2h-2z"/>
    {record && <g fill="#ffe0a0"><path d="M113 17h2v3h3v2h-3v3h-2v-3h-3v-2h3zM143 30h1v2h2v1h-2v2h-1v-2h-2v-1h2z"/></g>}
  </svg>
}

const hints = {
  time: 'Reach for the ring before the dot runs out.',
  early: 'Let the dot reach blue, then make your move.',
  wrong: 'Follow the ring. It marks your next hold.',
  broken: 'See a crack? The other holds are solid.',
}

type ResultProps = {
  run: Pick<ClimbState, 'height' | 'grips' | 'maxCombo' | 'reason'>
  previousBest: number
  restartRef: Ref<HTMLButtonElement>
  onRestart: () => void
}

export function ClimbResult({ run, previousBest, restartRef, onRestart }: ResultProps) {
  const { height, grips, maxCombo, reason } = run
  const record = height > previousBest
  const gap = previousBest - height
  const nearBest = height > 0 && gap > 0 && gap <= 2.8
  const hint = nearBest ? `Just ${formatHeight(gap)} m shy of your best.`
    : grips === 0 ? 'First move: reach left when the dot hits blue.'
    : hints[reason ?? 'time']
  return <section className={`climb-result${record ? ' is-record' : ''}`} aria-label="Climb result">
    <LandingScene record={record}/>
    <div className="result-content">
      <div className="result-altitude">
        <h3>{record ? <><Trophy/>New personal best</> : <><Flag/>Height climbed</>}</h3>
        <p>{formatHeight(height)}<span>m</span></p>
      </div>
      <p className="result-hint">{hint}</p>
      <dl className="result-splits">
        <div><dt>Holds</dt><dd>{grips}</dd></div>
        <div><dt>Best combo</dt><dd>{maxCombo}×</dd></div>
        {(previousBest > 0) && <div><dt>{record ? 'Previous best' : 'Personal best'}</dt><dd>{formatHeight(previousBest)} m</dd></div>}
      </dl>
      <button ref={restartRef} className="climb-primary result-retry" onClick={onRestart} aria-keyshortcuts="Enter Space"><RotateCcw size={17} aria-hidden="true"/>One more climb<kbd aria-hidden="true"><CornerDownLeft size={15}/></kbd></button>
    </div>
  </section>
}
