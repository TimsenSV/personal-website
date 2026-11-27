export type ProductId = 'shopvibes' | 'showcase' | 'backlane'
export type ImageAsset = { src: string; alt: string }
export type ProductScreenshot = ImageAsset & { caption?: string; width?: number; height?: number }
export type ProfilePhoto = ImageAsset & { width?: number; height?: number; preview?: { src: string; width: number }; caption?: string; placeholder?: boolean; position?: string; zoom?: number; monochrome?: boolean }

export type Product = {
  id: ProductId
  name: string
  logo: ImageAsset
  category: string
  headline: string
  summary: string
  shortDescription: string
  role: string | null
  problem: string
  approach: string
  contribution: string | null
  decision: string | null
  image: ImageAsset | null
  screenshots: ProductScreenshot[]
  url: string | null
}

export type PortfolioConfig = {
  profile: {
    name: string
    nicknameSuffix: string
    monogram: string
    positioning: string
    introduction: string
    personal: string
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
  spotify: { title: string; note: string | null; url: string | null; cover: ImageAsset | null }
  legal: {
    name: string
    address: string[]
    email: { local: string[]; domain: string[] }
    updatedAt: string
  }
  running: { title: string; note: string; stravaUrl: string | null; routeName: string | null; goal: string | null }
  products: Product[]
  seo: {
    title: string; description: string; url: string
    image: { src: string; alt: string; width: number; height: number; type: string }
  }
}

// All personal content lives here. null means deliberately not yet supplied.
// Place your own images in public/images and use relative paths: 'images/portrait.jpg'.
// Book-cover graphics are illustrative. Product galleries contain real website and app captures.
export const siteConfig: PortfolioConfig = {
  profile: {
    name: 'Tim',
    nicknameSuffix: 'sen',
    monogram: 't.',
    positioning: 'Product builder. Real problems, solved (mostly) with AI.',
    introduction: 'I like to start with “Can you show me?” I set the direction, build prototypes, and ship with the team. Then I go back to users to see what we missed.',
    personal: 'Somewhere between product ideas, a good playlist and the next hold.',
    // Stylised game avatar with brown-blond hair as supplied by Tim; not a portrait.
    pixelAvatar: { hair: '#9b774b', hairHighlight: '#ccb27b', skin: '#edbb96', shirt: '#3159f5', trousers: '#30394f', chalkBag: '#ff7140' },
    // User-supplied photos in carousel order. Web derivatives only.
    photos: [
      { src: 'images/photos/08-outdoor-portrait.webp', width: 640, height: 640, alt: 'Tim wearing glasses and a backpack outdoors' },
      { src: 'images/photos/01-portrait.webp', preview: { src: 'images/photos/01-portrait-small.webp', width: 640 }, width: 1600, height: 1600, alt: 'Tim smiling in front of a blue and turquoise wall' },
      { src: 'images/photos/02-profile.webp', width: 640, height: 640, alt: 'Black-and-white side portrait of Tim wearing glasses' },
      { src: 'images/photos/03-climbing-wall.webp', preview: { src: 'images/photos/03-climbing-wall-small.webp', width: 480 }, width: 1200, height: 1600, alt: 'Tim climbing an indoor wall with colourful holds', position: '50% 40%' },
      { src: 'images/photos/04-climbing.webp', preview: { src: 'images/photos/04-climbing-small.webp', width: 480 }, width: 1200, height: 1600, alt: 'Tim hanging in his climbing harness, seen from below', position: '50% 55%' },
      { src: 'images/photos/05-evening.webp', preview: { src: 'images/photos/05-evening-small.webp', width: 480 }, width: 1200, height: 1600, alt: 'Tim laughing at an outdoor table under warm lights', position: '50% 30%' },
      { src: 'images/photos/06-climbing-gear.webp', preview: { src: 'images/photos/06-climbing-gear-small.webp', width: 480 }, width: 1200, height: 1600, alt: 'A view down at climbing gear clipped to a harness' },
      { src: 'images/photos/07-city-evening.webp', preview: { src: 'images/photos/07-city-evening-small.webp', width: 480 }, width: 1200, height: 1600, alt: 'Tim in a cap sitting beside a stone wall on an evening street', position: '50% 28%' },
    ],
    email: null,
    linkedinUrl: 'https://www.linkedin.com/in/timsenhoffmann/',
  },
  github: {
    username: 'TimsenSV',
    playfulPullRequests: [
      { title: 'AI now occasionally admits “I don’t know”', tag: 'fix / hallucinations' },
      { title: 'Context window now opens for fresh air', tag: 'feat / context' },
      { title: 'Rescue agents from their infinite loop', tag: 'chore / agents' },
      { title: 'Added “please” to the prompt', tag: 'chore / prompt engineering' },
      { title: 'Model no longer needs the last word', tag: 'fix / chat' },
      { title: 'RAG can finally find its own notes', tag: 'fix / retrieval' },
      { title: 'Token budget downgraded from YOLO to economy', tag: 'perf / tokens' },
      { title: 'Agent asks before founding a company', tag: 'fix / autonomy' },
      { title: 'Lower temperature. Model has chilled out.', tag: 'fix / inference' },
      { title: 'Retired “As an AI language model…”', tag: 'refactor / tone' },
      { title: 'Added common sense to the test suite', tag: 'test / evals' },
      { title: 'Chain of thought takes a coffee break', tag: 'perf / reasoning' },
    ],
    repositories: [{
      name: 'personal-website',
      description: 'My little corner of the internet. A personal canvas to explore and keep building.',
      url: null,
      tags: ['React', 'TypeScript'],
    }],
  },
  spotify: {
    title: 'Timsen',
    note: null,
    url: 'https://open.spotify.com/playlist/7crg0zzkXhWfEMMetYnd6O',
    cover: { src: 'images/photos/02-profile.webp', alt: 'Cover of the Spotify playlist Timsen' },
  },
  legal: {
    name: 'Tim Hoffmann',
    address: ['Renatastr. 32', '80634 München', 'Germany'],
    // Assembled only inside the legal window; deters simple source-text harvesting.
    email: { local: ['tim', 'hoffmann96'], domain: ['gmx', 'de'] },
    updatedAt: '2026-11-17',
  },
  running: {
    title: 'Join me on my quest to not die in a half marathon.',
    note: 'Not everything needs a screen.',
    stravaUrl: 'https://www.strava.com/athletes/137493657',
    routeName: null,
    goal: 'Make it through a half marathon.',
  },
  products: [
    {
      id: 'shopvibes', name: 'shopvibes', category: 'Information',
      logo: { src: 'images/projects/shopvibes/logo.svg', alt: 'shopvibes' },
      headline: 'Turn product data into retail-ready listings.',
      summary: 'Structure and enrich your catalogue with AI, then deliver the right product data to each sales channel.',
      shortDescription: 'Product data, ready for your sales channels.', role: 'Chief Product Officer',
      screenshots: [
        {
          src: 'images/projects/shopvibes/01-website.jpg',
          alt: 'shopvibes website hero showing product data flowing into retailer formats',
          caption: 'A PIM built for distribution.', width: 1340, height: 764,
        },
        {
          src: 'images/projects/shopvibes/02-catalogue.png',
          alt: 'shopvibes demo catalogue with product images, data quality and sales channel coverage',
          caption: 'Product data, quality and channel coverage in one view.', width: 2000, height: 1125,
        },
        {
          src: 'images/projects/shopvibes/03-channels.png',
          alt: 'shopvibes demo partner overview with retail channels and export templates',
          caption: 'From one catalogue to your sales channels.', width: 2000, height: 1125,
        },
      ],
      problem: 'Product information lives in different places, comes in different formats and needs to meet different channel requirements. Working with it quickly turns into manual work.',
      approach: 'shopvibes uses AI to structure and maintain product data, making it useful wherever products are sold.',
      contribution: null, decision: null, image: null, url: 'https://www.shop-vibes.de/',
    },
    {
      id: 'showcase', name: 'showcase', category: 'Presentation',
      logo: { src: 'images/projects/showcase/logo.svg', alt: 'showcase' },
      headline: 'Create lifestyle product images without a photoshoot.',
      summary: 'Turn product cutouts into photorealistic room scenes and product imagery with AI. Built for furniture and home & living.',
      shortDescription: 'Product imagery without a photoshoot.', role: 'Co-founder & CPO',
      screenshots: [
        {
          src: 'images/projects/showcase/01-website.jpg',
          alt: 'showcase homepage with a product photo upload form above a carousel of living and dining room scenes',
          caption: 'From one product photo to a gallery of room scenes.', width: 1440, height: 960,
        },
        {
          src: 'images/projects/showcase/02-studio.png',
          alt: 'showcase demo studio with furniture cutouts and image-generation controls',
          caption: 'Product cutouts and creative controls, side by side.', width: 2000, height: 1125,
        },
        {
          src: 'images/projects/showcase/03-variations.jpg',
          alt: 'showcase demo library showing sofa colour variations, room scenes and camera angles',
          caption: 'One sofa. Different rooms, colours and perspectives.', width: 2000, height: 1125,
        },
      ],
      problem: 'Isolating a product is one thing. Showing how it feels in a room is another. With furniture, context makes a difference.',
      approach: 'showcase uses AI for product photography and visual storytelling, with a focus on furniture and home & living.',
      contribution: null, decision: null, image: null, url: 'https://getshowcase.ai/en/',
    },
    {
      id: 'backlane', name: 'backlane', category: 'Action',
      logo: { src: 'images/projects/backlane/logo.svg', alt: 'backlane' },
      headline: 'Run your marketplace work from your AI chat.',
      summary: 'Connect your seller accounts to ChatGPT or Claude and handle marketplace workflows through conversation.',
      shortDescription: 'Marketplace workflows, right in your AI chat.', role: null,
      screenshots: [
        {
          src: 'images/projects/backlane/01-website.jpg',
          alt: 'backlane website hero introducing its MCP connection for e-commerce teams',
          caption: 'Your marketplace work, in your AI chat.', width: 1186, height: 749,
        },
        {
          src: 'images/projects/backlane/02-welcome.png',
          alt: 'backlane sign-in screen alongside an illustrative product-launch check in an AI conversation',
          caption: 'A first look at everyday marketplace workflows.', width: 2000, height: 1143,
        },
        {
          src: 'images/projects/backlane/03-integrations.png',
          alt: 'backlane integrations screen showing AI assistant setup and connected Kaufland, home24 and OTTO accounts',
          caption: 'Your marketplaces and AI connection, in one place.', width: 2000, height: 1122,
        },
      ],
      problem: 'Marketplace work is spread across different tools and repetitive tasks. There are often too many clicks between a question and getting it done.',
      approach: 'backlane connects marketplaces to AI assistants like ChatGPT and Claude, letting you run workflows through your assistant.',
      contribution: null, decision: null, image: null, url: 'https://getbacklane.com/en/',
    },
  ],
  seo: {
    url: 'https://timsen.me/',
    title: 'Tim — Products, perspectives & a little movement',
    description: 'A look into my world of product development, UX, AI and e-commerce. Featuring shopvibes, showcase, backlane, music and movement.',
    image: {
      src: 'images/social/timsen-preview.jpg',
      alt: 'Tim Hoffmann — Product, UX & an entrepreneurial mindset. A portrait of Tim alongside shopvibes, showcase and backlane project books.',
      width: 1200, height: 630, type: 'image/jpeg',
    },
  },
}
