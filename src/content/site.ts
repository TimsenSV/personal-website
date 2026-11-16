export type ProductId = 'shopvibes' | 'showcase' | 'backlane'
export type ImageAsset = { src: string; alt: string }

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
    portrait: ImageAsset | null
    email: string | null
    linkedinUrl: string | null
  }
  github: {
    username: string | null
    repositories: { name: string; description: string; url: string | null; tags: string[] }[]
  }
  spotify: { title: string; note: string; url: string | null; cover: ImageAsset | null }
  running: { title: string; note: string; routeName: string | null; goal: string | null }
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
    portrait: null,
    email: null,
    linkedinUrl: null,
  },
  github: {
    username: null,
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
    title: 'Kopf frei. Weiterlaufen.',
    note: 'Nicht alles braucht einen Bildschirm.',
    routeName: null,
    goal: null,
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
