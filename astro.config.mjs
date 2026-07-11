// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// NIXFRED GALAXY: static output, canonical production URL.
// Contract: docs/ARCHITECTURE.md (islands, lazy Three.js), docs/CI_CD.md (dist artifact).
export default defineConfig({
  site: 'https://galaxy.nixfred.com',
  output: 'static',
  outDir: 'dist',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [sitemap()],
  // A script used by only one page is small enough that Astro/Vite would
  // otherwise inline it directly into that page's HTML. That would violate
  // the CSP's script-src 'self' (no inline scripts), so force every script
  // to build as a real external file under /_astro/ (docs/SECURITY_PLAN.md).
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
