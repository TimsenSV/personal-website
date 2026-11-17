import { memo } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const tileHeight = 560
const layers = [
  { name: 'far', speed: 12 },
  { name: 'middle', speed: 25 },
  { name: 'near', speed: 43 },
] as const

function Scenery({ layer }: { layer: typeof layers[number]['name'] }) {
  if (layer === 'far') return <g className="climb-clouds">
    <path d="M80 64h24V48h40v16h32v12h16v18H64V76h16zM258 212h24v-16h35v16h28v14h15v17H240v-17h18zM154 410h20v-14h42v14h30v14h15v18H136v-18h18z"/>
    <path d="M40 162h42v9H40zM342 368h52v9h-52z" opacity=".55"/>
  </g>
  if (layer === 'middle') return <g className="climb-distant-rock">
    <path d="M0 0h65v38h18v73H70v64h24v54H76v78H60v47h24v81H70v61h-5v64H0zM440 0h-65v64h-20v66h16v68h-25v54h19v73h18v63h-27v64h19v108h65z"/>
    <path className="rock-face" d="M0 0h28v55h23v73H37v62h18v63H26v67h17v87H22v72h6v81H0zM440 0h-24v85h-19v70h16v92h-25v72h22v65h-12v89h18v87h24z"/>
  </g>
  return <g className="climb-near-rock">
    <path d="M0 0h21v56h15v61H18v70h25v64H30v72H18v64h17v55H21v118H0zM440 0h-20v38h-16v84h20v65h-29v74h16v68h15v68h-25v70h19v93h20z"/>
    <path className="rock-light" d="M20 56h16v9H20zM18 187h25v8H18zM18 387h17v8H18zM404 38h16v8h-16zM395 187h29v8h-29zM401 397h25v8h-25z"/>
  </g>
}

export const ClimbBackdrop = memo(function ClimbBackdrop({ step }: { step: number }) {
  const reduced = useReducedMotion()
  return <svg className="climb-backdrop" viewBox="0 0 440 560" preserveAspectRatio="none" aria-hidden="true">
    {layers.map(layer => {
      // The wall travels 100 units per hold. Distant scenery moves much less.
      const offset = reduced ? 0 : step * layer.speed
      const tile = Math.floor(offset / tileHeight)
      return <g key={layer.name} data-depth={layer.name}>
        {[tile - 1, tile, tile + 1, tile + 2].map(index => <g key={index} className="climb-parallax-tile" style={{ transform: `translateY(${offset - index * tileHeight}px)` }}><Scenery layer={layer.name}/></g>)}
      </g>
    })}
  </svg>
})
