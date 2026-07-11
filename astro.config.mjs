// @ts-check
import { defineConfig } from 'astro/config';

// NIXFRED GALAXY: static output, canonical production URL.
// Contract: docs/ARCHITECTURE.md (islands, lazy Three.js), docs/CI_CD.md (dist artifact).
export default defineConfig({
  site: 'https://galaxy.nixfred.com',
  output: 'static',
  outDir: 'dist',
  build: {
    inlineStylesheets: 'auto',
  },
});
