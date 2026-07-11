// Atlas mode contract: FR049-FR053, AC021 (fully usable with zero JS).
// The catalog count here is derived from the same data pipeline the app
// uses, not a hardcoded number, so this test tracks the real catalog.
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

test.describe('atlas', () => {
  test('page is usable: h1 visible (FR049)', async ({ page }) => {
    await page.goto('/atlas/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Atlas' }),
    ).toBeVisible();
  });

  test('every catalog entry appears, each linked to its project page (AC021)', async ({
    page,
  }) => {
    await page.goto('/atlas/');
    const items = page.getByTestId('atlas-item');
    await expect(items).toHaveCount(nodes.length);

    for (const node of nodes) {
      const link = page.locator(
        `a.atlas-item__link[href="/project/${node.slug}/"]`,
      );
      await expect(link).toBeVisible();
    }
  });

  test('search input is present (FR050)', async ({ page }) => {
    await page.goto('/atlas/');
    await expect(page.locator('#atlas-search')).toBeVisible();
  });

  test('all six sector sections are present (FR049)', async ({ page }) => {
    await page.goto('/atlas/');
    await expect(page.locator('.atlas-section')).toHaveCount(6);
    for (const sector of sectors) {
      await expect(
        page.locator(`.atlas-section[data-sector="${sector.id}"]`),
      ).toBeVisible();
    }
  });

  test('sector filter narrows the visible list (FR028, progressive enhancement)', async ({
    page,
  }) => {
    await page.goto('/atlas/');
    const labsCount = nodes.filter((n) => n.sector === 'labs').length;
    await page.locator('[data-sector-filter="labs"]').click();
    await expect(
      page.locator('[data-testid="atlas-item"]:visible'),
    ).toHaveCount(labsCount);
    await expect(page.getByTestId('atlas-count')).toContainText(
      `Showing ${labsCount} of ${nodes.length} projects`,
    );
  });
});
