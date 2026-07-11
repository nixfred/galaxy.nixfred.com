// Phase 4: command palette (FR023-FR027, AC014) and guided tours
// (FR039-FR043, AC018) with shareable tour URLs (AC016 pattern).
import { expect, test } from '@playwright/test';

async function waitOnline(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.waitForSelector('[data-map-state="online"]', { timeout: 15_000 });
}

test.describe('command palette', () => {
  test('opens with the slash key and focuses the input (FR023)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('/');
    await expect(page.getByTestId('galaxy-palette')).toBeVisible();
    await expect(page.getByTestId('palette-input')).toBeFocused();
  });

  test('opens with Control+K (FR023)', async ({ page }) => {
    await waitOnline(page);
    await page.keyboard.press('Control+k');
    await expect(page.getByTestId('galaxy-palette')).toBeVisible();
  });

  test('searching a project and Enter selects it (FR024, FR026, AC014)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('/');
    await page.getByTestId('palette-input').fill('code audit');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('galaxy-palette')).toBeHidden();
    await expect(page.getByTestId('galaxy-panel')).toBeVisible();
    await expect(page.locator('#galaxy-panel-title')).toHaveText(
      'The Code Audit',
    );
    await expect(page).toHaveURL(/\?p=the-code-audit/);
  });

  test('Escape closes the palette and restores focus (FR027)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('/');
    await expect(page.getByTestId('galaxy-palette')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('galaxy-palette')).toBeHidden();
  });
});

test.describe('guided tours', () => {
  test('a tour advances, goes back, and exits (FR041, AC018)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('/');
    await page.getByTestId('palette-input').fill('start here');
    await page.keyboard.press('Enter');
    const bar = page.getByTestId('galaxy-tour');
    await expect(bar).toBeVisible();
    await expect(page.locator('#galaxy-tour-meta')).toContainText('STOP 1 OF');
    await expect(page).toHaveURL(/tour=start-here/);
    await page.getByTestId('tour-next').click();
    await expect(page.locator('#galaxy-tour-meta')).toContainText('STOP 2 OF');
    await page.getByTestId('tour-prev').click();
    await expect(page.locator('#galaxy-tour-meta')).toContainText('STOP 1 OF');
    await page.getByTestId('tour-exit').click();
    await expect(bar).toBeHidden();
    await expect(page).not.toHaveURL(/tour=/);
  });

  test('a tour deep link starts the tour after scene ready (FR043)', async ({
    page,
  }) => {
    await page.goto('/?tour=space-and-physics');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await expect(page.getByTestId('galaxy-tour')).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.locator('#galaxy-tour-meta')).toContainText(
      'Space and Physics',
    );
  });
});
