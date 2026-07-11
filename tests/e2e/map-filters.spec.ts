// Phase 4: sector filters (FR028-FR031, AC017 map half) and SURPRISE ME
// (FR059, AC020 browser half; the seeded no-repeat property also has a
// deterministic unit-level check via the session sequence storage).
import { expect, test } from '@playwright/test';

async function waitOnline(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.waitForSelector('[data-map-state="online"]', { timeout: 15_000 });
}

test.describe('map filters and surprise', () => {
  test('isolating a sector updates the count and constrains keyboard order (FR028, FR030)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.locator('[data-map-filter="signal"]').click();
    await expect(page.getByTestId('galaxy-filter-count')).toContainText(
      /\d+ PROJECTS VISIBLE/,
    );
    // Keyboard cycling now only reaches Signal-sector stars.
    await page.keyboard.press('ArrowRight');
    const status = page.locator('#galaxy-panel-status');
    await expect(status).toContainText('SECTOR: SIGNAL');
    await page.keyboard.press('ArrowRight');
    await expect(status).toContainText('SECTOR: SIGNAL');
  });

  test('filtering away the selected sector closes the selection (FR029)', async ({
    page,
  }) => {
    await page.goto('/?p=meet-larry');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await expect(page.getByTestId('galaxy-panel')).toBeVisible();
    // Meet Larry lives in Signal; isolate a different sector.
    await page.locator('[data-map-filter="labs"]').click();
    await expect(page.getByTestId('galaxy-panel')).toBeHidden();
  });

  test('clearing the filter restores the full map (FR031 reset path)', async ({
    page,
  }) => {
    await waitOnline(page);
    const labs = page.locator('[data-map-filter="labs"]');
    await labs.click();
    await expect(labs).toHaveAttribute('aria-pressed', 'true');
    await labs.click();
    await expect(labs).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('galaxy-filter-count')).toHaveText('');
  });

  test('SURPRISE ME selects a project and avoids immediate repeats (FR059)', async ({
    page,
  }) => {
    await waitOnline(page);
    const surprise = page.getByTestId('galaxy-surprise');
    await surprise.click();
    await expect(page.getByTestId('galaxy-panel')).toBeVisible();
    const first = new URL(page.url()).searchParams.get('p');
    expect(first).toBeTruthy();
    const picks = new Set<string>([first!]);
    for (let i = 0; i < 4; i++) {
      await surprise.click();
      const slug = new URL(page.url()).searchParams.get('p');
      expect(slug, 'surprise repeated a session pick').not.toBe(null);
      expect(picks.has(slug!), `repeat pick ${slug}`).toBe(false);
      picks.add(slug!);
    }
  });
});
