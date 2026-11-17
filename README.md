# Tim Hoffmann — Personal portfolio

An interactive portfolio with a product bookshelf, photo polaroids, GitHub activity and the **Grip Happens** climbing game.

Built with React, TypeScript and Vite. Static site; no backend or database required.

## Run locally

Requires Node.js **22.12+**.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173.

## Commands

- `npm run check` — lint, tests and production build
- `npm run build` — build the website into `dist/`
- `npm run preview` — preview the build locally

## Content

- `src/content/site.ts` — profile, photos, products and links
- `src/content/cv.ts` — CV content and download
- `public/` — images, fonts, CV PDF and GitHub activity snapshot

## Deployment

Target domain: **timsen.me**. Hosting: GitHub Pages via GitHub Actions.

To publish, run **Publish portfolio to GitHub Pages** from the repository’s Actions tab on `codex/setup`. Deployment is manual; pushing changes does not publish them.
