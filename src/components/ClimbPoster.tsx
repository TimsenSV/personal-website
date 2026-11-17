import { ClimbingTim } from './ClimbingTim'
import { PixelType } from './PixelType'

export function ClimbPoster() {
  return <>
    <svg className="climb-poster-landscape" viewBox="0 0 440 560" preserveAspectRatio="none" aria-hidden="true" shapeRendering="crispEdges">
      {['#172e65','#254782','#4164a0','#6687b8','#97adc9','#cec3bd','#f1c4a0','#ffd49a'].map((color, i) => <rect key={color} y={i * 70} width="440" height="70" fill={color}/>)}
      <g fill="#e5edff"><path d="M44 54h3v3h-3zM367 34h3v3h-3zM331 91h2v2h-2zM95 22h2v2h-2zM408 127h3v3h-3z"/><path d="M57 113h4v-4h3v4h4v3h-4v4h-3v-4h-4z"/></g>
      <path d="M166 240h108v12h16v14h12v70H138v-70h12v-14h16z" fill="#ffe6b0"/>
      <path d="M0 356h24v-26h24v-36h20v-36h24v-32h24v32h20v25h20v30h28v29h28v-29h24v-32h20v-40h24v-33h20v-28h20v28h20v28h20v38h24v36h24v25h16v26h20v150H0z" fill="#8e9dbb"/>
      <path d="M68 258h24v-32h24v32h20v25h-20v-13H92v13H68zM280 241v-33h20v-28h20v28h20v28h20v18h-20v-10h-20v-18h-20v15z" fill="#e3ddea"/>
      <path d="M0 414h24v-32h24v-28h24v-22h24v27h24v25h24v28h32v24h40v-26h28v-34h24v-32h24v-30h24v-30h24v32h24v26h24v38h24v26h28v154H0z" fill="#52658f"/>
      <path d="M0 494h40v-26h40v-18h32v24h40v30h40v-22h32v-20h32v-24h32v-22h24v26h32v28h32v18h64v72H0z" fill="#293e69"/>
      <path d="M124 429h20v-12h152v12h20v22H124z" fill="#efcead"/>
      <path d="M136 451h168v109H136z" fill="#a9786e"/><path d="M136 451h25v109h-25zM280 451h24v109h-24z" fill="#805d65"/>
      <path d="M166 466h44v8h-44zM243 492h36v8h-36zM188 530h32v8h-32z" fill="#c99781"/>
    </svg>
    <h3 className="climb-poster-logo" aria-label="Grip Happens"><PixelType text="GRIP"/><PixelType text="HAPPENS"/></h3>
    <svg className="climb-poster-hero" viewBox="0 0 160 180" aria-hidden="true" shapeRendering="crispEdges">
      <ellipse className="poster-tim-shadow" cx="80" cy="158" rx="28" ry="4" fill="#503850" opacity=".25"/>
      <g transform="translate(18 8) scale(3)"><g className="poster-tim"><ClimbingTim pose="hero"/></g></g>
      <g className="poster-dust" fill="#fff1d5"><path d="M26 148h6v6h-6zM120 143h5v5h-5zM35 137h3v3h-3zM113 133h4v4h-4z"/></g>
    </svg>
  </>
}
