// Phase 3b selection lifecycle gates: keyboard selection (AR003), the detail
// panel with focus management (FR018, FR019, AR004), stable deep links
// (FR020, AC015), restoration after scene ready (AC016), and history
// semantics (FR021).
import { expect, test } from '@playwright/test';

async function waitOnline(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.waitForSelector('[data-map-state="online"]', { timeout: 15_000 });
}

test.describe('map selection lifecycle', () => {
  test('arrow key selects a star, panel opens, URL updates (AR003, FR020)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('ArrowRight');
    const panel = page.getByTestId('galaxy-panel');
    await expect(panel).toBeVisible();
    // Anchors come first in keyboard order; the first is a real project.
    await expect(page.locator('#galaxy-panel-title')).not.toBeEmpty();
    await expect(page).toHaveURL(/\?p=[a-z0-9-]+/);
    // AR004: focus moved into the panel.
    await expect(page.getByTestId('panel-close')).toBeFocused();
  });

  test('Escape closes the panel, clears the URL, camera deselects (FR021)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('galaxy-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('galaxy-panel')).toBeHidden();
    await expect(page).not.toHaveURL(/\?p=/);
  });

  test('deep link restores selection after scene ready (AC015, AC016)', async ({
    page,
  }) => {
    await page.goto('/?p=meet-larry');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    const panel = page.getByTestId('galaxy-panel');
    await expect(panel).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('#galaxy-panel-title')).toHaveText('Meet Larry');
    await expect(page.getByTestId('panel-open-project')).toHaveAttribute(
      'rel',
      /noopener/,
    );
  });

  test('browser back returns to the prior selection state (FR021)', async ({
    page,
  }) => {
    await waitOnline(page);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\?p=/);
    const first = new URL(page.url()).searchParams.get('p');
    await page.keyboard.press('ArrowRight');
    const second = new URL(page.url()).searchParams.get('p');
    expect(second).not.toBe(first);
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`\\?p=${first}`));
    await expect(page.locator('#galaxy-panel-title')).not.toBeEmpty();
  });

  test('related project links move the selection along an edge (FR017 area)', async ({
    page,
  }) => {
    await page.goto('/?p=meet-larry');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await expect(page.getByTestId('galaxy-panel')).toBeVisible();
    const related = page.locator('.galaxy-panel__related-link').first();
    await expect(related).toBeVisible();
    await related.click();
    await expect(page.locator('#galaxy-panel-title')).not.toHaveText(
      'Meet Larry',
    );
    await expect(page).not.toHaveURL(/p=meet-larry/);
  });
});
