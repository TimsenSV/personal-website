export type ProductId = 'shopvibes' | 'showcase' | 'backlane'
export type ImageAsset = { src: string; alt: string }
export type ProfilePhoto = ImageAsset & { caption?: string; placeholder?: boolean; position?: string; zoom?: number; monochrome?: boolean }

export type Product = {
  id: ProductId
  name: string
  category: string
  headline: string
  summary: string
  problem: string
  approach: string
  contribution: string | null
  decision: string | null
  image: ImageAsset | null
  url: string | null
}

export type PortfolioConfig = {
  profile: {
    name: string
    monogram: string
    positioning: string
    introduction: string
    personal: string
    focus: string
    pixelAvatar: { hair: string; hairHighlight: string; skin: string; shirt: string; trousers: string; chalkBag: string }
    photos: ProfilePhoto[]
    email: string | null
    linkedinUrl: string | null
  }
  github: {
    username: string | null
    playfulPullRequests: { title: string; tag: string }[]
    repositories: { name: string; description: string; url: string | null; tags: string[] }[]
  }
  spotify: { title: string; note: string; url: string | null; cover: ImageAsset | null }
  running: { title: string; note: string; stravaUrl: string | null; routeName: string | null; goal: string | null }
  products: Product[]
  seo: { title: string; description: string }
}

// All personal content lives here. null means deliberately not yet supplied.
// Place your own images in public/images and use relative paths: 'images/portrait.jpg'.
// Product graphics are illustrative; they are not screenshots or customer work.
export const siteConfig: PortfolioConfig = {
  profile: {
    name: 'Tim',
    monogram: 't.',
    positioning: 'Produkt, UX & unternehmerisches Denken.',
    introduction: 'Mich interessiert, wie aus komplexen Abläufen verständliche und nützliche Produkte werden.',
    personal: 'Zwischen Produktideen, Musik im Ohr und dem nächsten Griff.',
    focus: 'Wie KI im E-Commerce wirklich nützlich wird.',
    // Stilisiertes Spiel-Avatar mit braunblondem Haar nach eigener Angabe; kein Porträt.
    pixelAvatar: { hair: '#9b774b', hairHighlight: '#ccb27b', skin: '#edbb96', shirt: '#3159f5', trousers: '#30394f', chalkBag: '#ff7140' },
    // One generated sample photo in three treatments, until real personal photos are supplied.
    photos: [
      { src: 'images/portrait-sample.png', alt: 'KI-generiertes Musterporträt, kein Foto von Tim', placeholder: true },
      { src: 'images/portrait-sample.png', alt: 'Musterporträt in Schwarz-Weiß, kein Foto von Tim', placeholder: true, monochrome: true, zoom: 1.12 },
      { src: 'images/portrait-sample.png', alt: 'Näherer Ausschnitt des Musterporträts, kein Foto von Tim', placeholder: true, zoom: 1.35, position: '50% 35%' },
    ],
    email: null,
    linkedinUrl: 'https://www.linkedin.com/in/timsenhoffmann/',
  },
  github: {
    username: 'TimsenSV',
    playfulPullRequests: [
      { title: 'KI sagt jetzt auch mal „weiß ich nicht“', tag: 'fix / hallucinations' },
      { title: 'Kontextfenster kann jetzt stoßlüften', tag: 'feat / context' },
      { title: 'Agenten aus der Endlosschleife abholen', tag: 'chore / agents' },
      { title: 'Prompt um „bitte“ ergänzt', tag: 'chore / prompt engineering' },
      { title: 'Dem Modell das letzte Wort abgewöhnt', tag: 'fix / chat' },
      { title: 'RAG findet jetzt die eigenen Notizen', tag: 'fix / retrieval' },
      { title: 'Tokenbudget von YOLO auf Sparflamme', tag: 'perf / tokens' },
      { title: 'Agent fragt, bevor er die Firma gründet', tag: 'fix / autonomy' },
      { title: 'Temperatur runter. Modell entspannt.', tag: 'fix / inference' },
      { title: '„Als KI-Sprachmodell …“ in Rente geschickt', tag: 'refactor / tone' },
      { title: 'Gesunden Menschenverstand zum Test ergänzt', tag: 'test / evals' },
      { title: 'Chain of Thought macht kurz Pause', tag: 'perf / reasoning' },
    ],
    repositories: [{
      name: 'personal-website',
      description: 'Dieses kleine Stück Internet. Eine persönliche Canvas zum Entdecken und Weiterbauen.',
      url: null,
      tags: ['React', 'TypeScript'],
    }],
  },
  spotify: {
    title: 'Musik gehört dazu.',
    note: 'Der Soundtrack zu meiner Welt bekommt hier seinen Platz.',
    url: null,
    cover: null,
  },
  running: {
    title: 'Join me on my quest to not die in a half marathon.',
    note: 'Nicht alles braucht einen Bildschirm.',
    stravaUrl: 'https://www.strava.com/athletes/137493657',
    routeName: null,
    goal: 'Einen Halbmarathon schaffen.',
  },
  products: [
    {
      id: 'shopvibes', name: 'shopvibes', category: 'Information',
      headline: 'Gute Daten. Mehr Möglichkeiten.',
      summary: 'Produktdaten mit KI strukturieren, pflegen und für Vertriebskanäle nutzbar machen.',
      problem: 'Produktinformationen sind oft verteilt, unterschiedlich aufgebaut und für jeden Vertriebskanal anders gefragt. Aus vorhandenen Daten wird dadurch schnell viel Handarbeit.',
      approach: 'shopvibes hilft dabei, Produktdaten mit KI zu strukturieren und zu pflegen — damit sie dort nutzbar werden, wo Produkte verkauft werden.',
      contribution: null, decision: null, image: null, url: null,
    },
    {
      id: 'showcase', name: 'showcase', category: 'Darstellung',
      headline: 'Ein Produkt. Ein neuer Kontext.',
      summary: 'KI-gestützte Produktfotografie und visuelle Inszenierung für Möbel und Home & Living.',
      problem: 'Ein Produkt freizustellen ist das eine. Zu zeigen, wie es sich in einem Raum anfühlt, ist etwas anderes. Gerade bei Möbeln entscheidet der Kontext mit.',
      approach: 'showcase nutzt KI für Produktfotografie und visuelle Inszenierung — mit einem besonderen Fokus auf Möbel und Home & Living.',
      contribution: null, decision: null, image: null, url: null,
    },
    {
      id: 'backlane', name: 'Backlane', category: 'Handlung',
      headline: 'Weniger wechseln. Mehr machen.',
      summary: 'Marktplätze mit KI-Assistenten verbinden und Arbeitsabläufe im Gespräch bedienen.',
      problem: 'Marktplatzarbeit verteilt sich auf unterschiedliche Oberflächen und wiederkehrende Arbeitsschritte. Zwischen einer Frage und ihrer Umsetzung liegen oft viele Klicks.',
      approach: 'Backlane verbindet Marktplätze mit KI-Assistenten wie ChatGPT und Claude. So werden Arbeitsabläufe über die Assistenten bedienbar.',
      contribution: null, decision: null, image: null, url: null,
    },
  ],
  seo: {
    title: 'Tim — Produkte, Perspektiven & ein bisschen Bewegung',
    description: 'Ein Einblick in meine Welt zwischen Produktentwicklung, UX, KI und E-Commerce. Mit shopvibes, showcase, Backlane, Musik und Bewegung.',
  },
}
