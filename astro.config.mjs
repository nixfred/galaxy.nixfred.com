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
      rollupOptions: {
        output: {
          // Three.js and the graph module graph (docs/ARCHITECTURE.md
          // section 3) are only ever reached via GalaxyStage's dynamic
          // import(), never from shell code, so forcing them into one named
          // chunk keeps PR005's "single dynamically imported chunk" true and
          // gives scripts/report-bundle.ts a filename its viz/shell regex
          // can actually classify correctly, instead of an arbitrary
          // content-hashed name that would silently count three.js against
          // the 150KB shell budget (PR004) rather than the 300KB viz one.
          // Named "three-viz", not "galaxy-stage": Astro's own per-component
          // bootstrap script chunk is auto-named after GalaxyStage.astro, and
          // report-bundle.ts's viz-detecting regex would otherwise match that
          // filename too, misclassifying the small shell-budget bootstrap
          // script (PR002's lazy-import trigger) as part of the viz bundle.
          manualChunks(id) {
            const normalized = id.replace(/\\/g, '/');
            if (
              normalized.includes('/node_modules/three/') ||
              normalized.includes('/src/lib/graph/')
            ) {
              return 'three-viz';
            }
            return undefined;
          },
        },
      },
    },
  },
});
