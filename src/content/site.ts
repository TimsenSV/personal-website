export type ProductId = 'shopvibes' | 'showcase' | 'backlane'
export type ImageAsset = { src: string; alt: string }
export type ProductScreenshot = ImageAsset & { caption?: string; width?: number; height?: number }
export type ProfilePhoto = ImageAsset & { caption?: string; placeholder?: boolean; position?: string; zoom?: number; monochrome?: boolean }

export type Product = {
  id: ProductId
  name: string
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
    positioning: 'Product, UX & an entrepreneurial mindset.',
    introduction: 'I’m interested in turning complex workflows into clear, useful products.',
    personal: 'Somewhere between product ideas, a good playlist and the next hold.',
    focus: 'Making AI genuinely useful in e-commerce.',
    // Stylised game avatar with brown-blond hair as supplied by Tim; not a portrait.
    pixelAvatar: { hair: '#9b774b', hairHighlight: '#ccb27b', skin: '#edbb96', shirt: '#3159f5', trousers: '#30394f', chalkBag: '#ff7140' },
    // One generated sample photo in three treatments, until real personal photos are supplied.
    photos: [
      { src: 'images/portrait-sample.png', alt: 'AI-generated sample portrait, not a photo of Tim', placeholder: true },
      { src: 'images/portrait-sample.png', alt: 'Black-and-white sample portrait, not a photo of Tim', placeholder: true, monochrome: true, zoom: 1.12 },
      { src: 'images/portrait-sample.png', alt: 'Close-up of the sample portrait, not a photo of Tim', placeholder: true, zoom: 1.35, position: '50% 35%' },
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
    title: 'Life needs a soundtrack.',
    note: 'A little space for the soundtrack to my world.',
    url: null,
    cover: null,
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
      headline: 'Better data. More possibilities.',
      summary: 'Using AI to structure, maintain and prepare product data for sales channels.',
      shortDescription: 'AI for product data', role: 'Chief Product Officer', screenshots: [],
      problem: 'Product information lives in different places, comes in different formats and needs to meet different channel requirements. Working with it quickly turns into manual work.',
      approach: 'shopvibes uses AI to structure and maintain product data, making it useful wherever products are sold.',
      contribution: null, decision: null, image: null, url: null,
    },
    {
      id: 'showcase', name: 'showcase', category: 'Presentation',
      headline: 'One product. A new context.',
      summary: 'AI-powered product photography and visual storytelling for furniture and home & living.',
      shortDescription: 'AI product photography', role: 'Co-founder & CPO', screenshots: [],
      problem: 'Isolating a product is one thing. Showing how it feels in a room is another. With furniture, context makes a difference.',
      approach: 'showcase uses AI for product photography and visual storytelling, with a focus on furniture and home & living.',
      contribution: null, decision: null, image: null, url: null,
    },
    {
      id: 'backlane', name: 'Backlane', category: 'Action',
      headline: 'Less switching. More doing.',
      summary: 'Connecting marketplaces to AI assistants so workflows can happen through conversation.',
      shortDescription: 'Marketplaces, meet AI', role: null, screenshots: [],
      problem: 'Marketplace work is spread across different tools and repetitive tasks. There are often too many clicks between a question and getting it done.',
      approach: 'Backlane connects marketplaces to AI assistants like ChatGPT and Claude, letting you run workflows through your assistant.',
      contribution: null, decision: null, image: null, url: null,
    },
  ],
  seo: {
    title: 'Tim — Products, perspectives & a little movement',
    description: 'A look into my world of product development, UX, AI and e-commerce. Featuring shopvibes, showcase, Backlane, music and movement.',
  },
}
