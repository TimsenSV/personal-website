import { Check, CornerDownRight, Database, Image, Sparkles } from 'lucide-react'
import type { ProductId } from '../content/site'
import { BacklaneMark } from './Icons'

function ChairScene() {
  return <svg className="chair-scene" viewBox="0 0 300 220" fill="none" aria-hidden="true">
    <path d="M0 0h300v220H0z" fill="#e9e4db"/>
    <path d="M213 0v155l87 46V0z" fill="#ded9ce"/>
    <path d="m0 156 213-1 87 46v19H0z" fill="#e1dace"/>
    <path d="m18 0 39 156h24L106 0z" fill="#f9f6ed" opacity=".7"/>
    <ellipse cx="154" cy="191" rx="66" ry="10" fill="#82786a" opacity=".15"/>
    <path d="M106 137 96 191m77-53 16 54m-60-59-3 49m55-55 14 51" stroke="#725d4a" strokeWidth="7" strokeLinecap="round"/>
    <path d="M101 118c-5-22-9-59 9-64 15-5 46-3 53 10 7 14 7 39 14 60l-76-6Z" fill="#bd6847"/>
    <path d="M110 56c16 1 32-2 41 11s11 41 15 58" stroke="#cf835d" strokeWidth="4"/>
    <path d="m102 115 69 1c15 0 26 8 24 19-2 12-78 20-96 6-10-8-7-19 3-26Z" fill="#cc7a54"/>
    <path d="M99 137c21 10 74 5 94-6" stroke="#a85239" strokeWidth="4" strokeLinecap="round"/>
    <path d="M245 60v111" stroke="#6e6c5b" strokeWidth="3"/>
    <path d="M221 59c0-17 10-30 24-30s23 13 23 30h-47Z" fill="#f8f5e9"/>
    <ellipse cx="245" cy="173" rx="17" ry="3" fill="#7a776a"/>
    <path d="M220 60h49" stroke="#c6c0b4" strokeWidth="2"/>
  </svg>
}

export function ProductVisual({ id }: { id: ProductId }) {
  if (id === 'shopvibes') return <span className="product-visual visual-data" aria-hidden="true">
    <span className="data-sheet"><span className="mini-sheet-head"><span className="mini-swatch"/><span>Ein Produkt.<small>Viele Möglichkeiten.</small></span><Database size={13}/></span>
      <span className="data-line"><span>Material</span><strong>Eiche</strong><Check/></span>
      <span className="data-line"><span>Farbe</span><strong>Natur</strong><Check/></span>
      <span className="data-line"><span>Maße</span><strong>Strukturiert</strong><Check/></span>
      <span className="data-sheet-foot"><Sparkles size={11}/> Daten werden Möglichkeiten</span>
    </span><span className="data-sticker"><Check size={12}/> Bereit für mehr.</span>
  </span>
  if (id === 'showcase') return <span className="product-visual visual-studio" aria-hidden="true"><ChairScene/><span className="studio-badge"><Sparkles size={11}/> Ein neuer Blickwinkel</span><span className="studio-corner"><Image size={14}/></span></span>
  return <span className="product-visual visual-action" aria-hidden="true"><span className="chat-query">Was steht als Nächstes an?<CornerDownRight size={12}/></span><span className="connector-line"/><span className="backlane-node"><BacklaneMark/></span><span className="connector-branches"/><span className="channel-nodes"><i/><i/><i/></span><span className="action-caption">Fragen. Verbinden. Machen.</span></span>
}
