import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { siteConfig } from './src/content/site'

const escapeAttribute = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

export default defineConfig({
  // Relative asset paths also work below /repository-name/ on GitHub Pages.
  base: './',
  plugins: [react(), {
    name: 'portfolio-metadata',
    transformIndexHtml: (html) => html
      .replaceAll('__SITE_TITLE__', escapeAttribute(siteConfig.seo.title))
      .replaceAll('__SITE_DESCRIPTION__', escapeAttribute(siteConfig.seo.description))
      .replaceAll('__SITE_URL__', escapeAttribute(siteConfig.seo.url)),
  }],
  server: { port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
})
