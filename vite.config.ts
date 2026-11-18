import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { siteConfig } from './src/content/site'

const escapeAttribute = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

export default defineConfig({
  // Relative asset paths also work below /repository-name/ on GitHub Pages.
  base: './',
  build: {
    rollupOptions: {
      input: [fileURLToPath(new URL('./index.html', import.meta.url)), fileURLToPath(new URL('./blog/index.html', import.meta.url))],
    },
  },
  plugins: [react(), {
    name: 'portfolio-metadata',
    transformIndexHtml: (html) => html
      .replaceAll('__SITE_TITLE__', escapeAttribute(siteConfig.seo.title))
      .replaceAll('__SITE_DESCRIPTION__', escapeAttribute(siteConfig.seo.description))
      .replaceAll('__SITE_URL__', escapeAttribute(siteConfig.seo.url))
      .replaceAll('__SITE_IMAGE__', escapeAttribute(new URL(siteConfig.seo.image.src, siteConfig.seo.url).href))
      .replaceAll('__SITE_IMAGE_ALT__', escapeAttribute(siteConfig.seo.image.alt))
      .replaceAll('__SITE_IMAGE_TYPE__', escapeAttribute(siteConfig.seo.image.type))
      .replaceAll('__SITE_IMAGE_WIDTH__', String(siteConfig.seo.image.width))
      .replaceAll('__SITE_IMAGE_HEIGHT__', String(siteConfig.seo.image.height)),
  }],
  server: { port: 5173, strictPort: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
  },
})
