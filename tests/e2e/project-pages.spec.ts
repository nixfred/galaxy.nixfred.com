// Crawlable project page contract: FR054-FR056, F32/F33 (version + links
// present via the shared BaseLayout on every page, not just the shell).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { mergeCatalog } from '../../src/lib/catalog/merge';
import {
  snapshotSchema,
  enrichmentSchema,
  sectorsSchema,
} from '../../src/lib/catalog/schema';

// Playwright's Node ESM loader requires an import attribute for bare JSON
// imports; read and parse the data files directly instead.
const dataDir = fileURLToPath(new URL('../../src/data/', import.meta.url));
function loadJson(name: string): unknown {
  return JSON.parse(readFileSync(`${dataDir}${name}`, 'utf-8'));
}

const snapshotRaw = loadJson('portfolio.snapshot.json');
const enrichmentRaw = loadJson('galaxy.enrichment.json');
const sectorsRaw = loadJson('sectors.json');

const snapshot = snapshotSchema.parse(snapshotRaw);
const enrichment = enrichmentSchema.parse(enrichmentRaw).records;
const sectors = sectorsSchema.parse(sectorsRaw).sectors;
const { nodes } = mergeCatalog(snapshot, enrichment, sectors);
const bySlug = new Map(nodes.map((n) => [n.slug, n]));

const knownSlugs = ['meet-larry', 'sky-walrus', 'the-code-audit'] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const slug of knownSlugs) {
  const node = bySlug.get(slug);
  if (!node) throw new Error(`fixture slug missing from catalog: ${slug}`);

  test.describe(`project page: ${slug}`, () => {
    test('loads with the correct title', async ({ page }) => {
      await page.goto(`/project/${slug}/`);
      await expect(page).toHaveTitle(new RegExp(escapeRegExp(node.title)));
      await expect(
        page.getByRole('heading', { level: 1, name: node.title }),
      ).toBeVisible();
    });

    test('OPEN PROJECT links to the external URL with safe attributes', async ({
      page,
    }) => {
      await page.goto(`/project/${slug}/`);
      const open = page.getByTestId('open-project');
      await expect(open).toBeVisible();
      await expect(open).toHaveAttribute('href', node.url);
      await expect(open).toHaveAttribute('target', '_blank');
      await expect(open).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('return to Atlas link is present', async ({ page }) => {
      await page.goto(`/project/${slug}/`);
      const back = page.getByTestId('return-to-atlas');
      await expect(back).toBeVisible();
      await expect(back).toHaveAttribute('href', '/atlas/');
    });

    test('version and permanent links present (F32, F33)', async ({ page }) => {
      await page.goto(`/project/${slug}/`);
      const version = page.getByTestId('build-version');
      await expect(version).toBeVisible();
      await expect(version).not.toBeEmpty();
      await expect(
        page.locator('footer a[href="https://nixfred.com"]'),
      ).toBeVisible();
      await expect(page.getByTestId('repo-link')).toHaveAttribute(
        'href',
        'https://github.com/nixfred/galaxy.nixfred.com',
      );
    });
  });
}
