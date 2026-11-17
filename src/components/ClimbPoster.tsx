import { ClimbingTim } from './ClimbingTim'
import { PixelType } from './PixelType'

const sky = ['#162746','#24345e','#364676','#505589','#706698','#a47f9c','#d49b9d','#f4bb9c','#ffd7a7']

// Follow drawn ridge points in two-unit steps to keep the skyline on a pixel grid.
function ridge(points: readonly [number, number][]) {
  let path = `M${points[0][0]} 280V${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const [x0,y0] = points[i-1]
    const [x1,y1] = points[i]
    for (let x = x0 + 2; x <= x1; x += 2) {
      const y = Math.round((y0 + (y1-y0)*(x-x0)/(x1-x0)) / 2) * 2
      path += `H${x}V${y}`
    }
  }
  return path + 'V280Z'
}

const far = ridge([[0,161],[20,142],[34,149],[54,124],[70,138],[82,128],[106,150],[136,115],[146,121],[166,90],[170,99],[174,96],[194,126],[202,118],[220,138]])
const middle = ridge([[0,164],[18,156],[44,122],[48,125],[54,117],[58,136],[68,144],[72,142],[88,166],[104,174],[128,154],[146,147],[154,141],[168,151],[190,135],[204,147],[220,132]])
const valley = ridge([[0,177],[18,165],[36,174],[50,172],[84,195],[106,201],[134,188],[150,174],[168,181],[198,161],[220,155]])
const pines = [[1,183,1.4],[9,189,.9],[17,191,.8],[26,192,.65],[39,197,.8],[47,198,.5],[168,207,.65],[177,203,1],[184,201,.7],[193,200,1.2],[202,198,.85],[214,196,1.6]]

export function ClimbPoster() {
  return <>
    <svg className="climb-poster-landscape" viewBox="0 0 220 280" preserveAspectRatio="none" aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <pattern id="poster-dither" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h1v1H0zM2 2h1v1H2z" fill="white"/></pattern>
        <mask id="poster-speckles"><rect width="220" height="280" fill="url(#poster-dither)"/></mask>
        <path id="poster-pine" d="M-1-21h2v4h1v3h2v2H2v2h3v3H2v1h5v3H1v4h-2v-4h-6v-3h4v-1h-2v-3h3v-2h-2v-2h2v-3h1z"/>
      </defs>
      <rect width="220" height="280" fill={sky[0]}/>
      {sky.slice(1).map((color, i) => <g key={color} fill={color}>
        <rect y={18+i*19} width="220" height={262-i*19}/>
        <rect y={14+i*19} width="220" height="4" mask="url(#poster-speckles)"/>
      </g>)}
      <path d="M15 18h1v1h-1zM42 12h1v1h-1zM92 8h1v1h-1zM160 15h1v1h-1zM184 22h2v1h-2zM196 37h1v1h-1zM29 49h1v1h-1z" fill="#fbecd4"/>
      <path d="M84 119h4v-6h7v-4h24v4h7v6h4v23H84z" fill="#fff0cb"/>
      <path d="M0 109h22v2H0zM9 106h22v1H9zM138 101h31v2h-31zM154 98h21v1h-21zM76 133h26v2H76z" fill="#f9c2a7"/>
      <path d={far} fill="#9c849f"/>
      <path d="M140 120l26-30-5 18-5 3-2 7-4-1-4 7zM168 95l5 5 1-4 12 20-10-8-1 3-4-7zM40 141l14-17 7 6-6-1-4 6-2-1z" fill="#fae0cb"/>
      <path d="M166 90l-4 24-7 15 4-3-5 9 24-19zM54 124l4 14 10 5-6-9z" fill="#81778f"/>
      <path d={middle} fill="#71688b"/>
      <path d="M26 147l18-25 4 3 6-8-7 19-4-2-8 11z" fill="#ebc4ad"/>
      <path d="M54 117l-5 26-15 21 17-12-4 12 17-17-6-11zM146 148l8-7 10 8-7-2-10 9z" fill="#555c7f"/>
      <path d={valley} fill="#505779"/>
      <path d="M0 176l18-11 19 11-20-4zM175 182l25-21 20-5v5l-20 4z" fill="#79738c"/>
      <path d="M0 184l36 8 38 17 32 7 36-3 39-16 39-4v87H0z" fill="#333c5b"/>
      <g fill="#333c5b">{pines.map(([x,y,scale]) => <use key={x} href="#poster-pine" transform={`translate(${x} ${y}) scale(${scale})`}/>)}</g>
      <path d="M0 229h12v-5h14v-7h14v4h19v7h19v52H0zM157 241h13v-7h14v-9h15v-5h21v60h-63z" fill="#232c49"/>
      <path d="M39 230h9v-8h14v-7h17v-5h19v-2h38v3h11v5h9v9h-7v12h-8v12h-6v31H46z" fill="#956b73"/>
      <path d="M39 230h9v-8h14v-7h17v-5h19v-2h38v3h11v4h-24v2h-22v-2H79v3H64v6H51v6z" fill="#ffdbab"/>
      <path d="M117 215h30v2h9v8h-8v12h-7v12h-6v31h-19v-24h4v-16h7v-17h-10z" fill="#664e67"/>
      <path d="M50 236h19v-3h17v3H71v3H50zM72 221h15v2H72zM95 229h14v2H95zM107 247h11v3h-11zM57 255h14v2H57z" fill="#c38d83"/>
    </svg>
    <h3 className="climb-poster-logo" aria-label="Grip Happens"><PixelType text="GRIP"/><PixelType text="HAPPENS"/></h3>
    <svg className="climb-poster-hero" viewBox="0 0 160 162" preserveAspectRatio="xMidYMax meet" aria-hidden="true" shapeRendering="crispEdges">
      <path className="poster-tim-shadow" d="M41 156h70v3H98v2H48v-2h-7z" fill="#714d60" opacity=".45"/>
      <g transform="translate(16 2) scale(3)"><g className="poster-tim"><ClimbingTim pose="hero"/></g></g>
      <g className="poster-dust" fill="#fff1d5"><path d="M26 148h6v6h-6zM120 143h5v5h-5zM35 137h3v3h-3zM113 133h4v4h-4z"/></g>
    </svg>
  </>
}
