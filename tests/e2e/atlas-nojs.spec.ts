// AC021 gate: Atlas is visible and usable with JavaScript disabled.
// The catalog is server-rendered HTML; the filter script is enhancement only.
import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test.describe('atlas without JavaScript', () => {
  test('full catalog visible and navigable with JS disabled (AC021)', async ({
    page,
  }) => {
    await page.goto('/atlas/');
    // All six sector sections render.
    await expect(page.locator('.atlas-section')).toHaveCount(6);
    // Every catalog entry is present as a real link (server-rendered).
    const links = page.locator('a.atlas-item__link[href^="/project/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(36);
    // Navigation works without any script: follow the first project link.
    const firstHref = await links.first().getAttribute('href');
    await links.first().click();
    await expect(page).toHaveURL(new RegExp(firstHref ?? '/project/'));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // The permanent footer links survive too (F33 without JS).
    await expect(page.getByTestId('repo-link')).toBeVisible();
  });
});
