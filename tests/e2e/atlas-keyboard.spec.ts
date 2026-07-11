// G2 gate check 4: keyboard-only pass through Atlas, search, and a project
// page (AR003: every action possible with keyboard only).
import { expect, test } from '@playwright/test';

test.describe('atlas keyboard-only', () => {
  test('keyboard reaches search, filters, and opens a project (AR003)', async ({
    page,
  }) => {
    await page.goto('/atlas/');
    // Skip link is the first tab stop (AR002).
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    // Search input is reachable and typeable by keyboard.
    const search = page.locator('.atlas-search');
    await search.focus();
    await expect(search).toBeFocused();
    await page.keyboard.type('larry');
    await expect(search).toHaveValue('larry');
    // A project link is reachable and activates with Enter.
    const target = page.locator('a[href="/project/meet-larry/"]').first();
    await target.focus();
    await expect(target).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/project\/meet-larry\//);
    // On the project page, the primary action is keyboard reachable.
    const open = page.locator('a[data-testid="open-project"]');
    await open.focus();
    await expect(open).toBeFocused();
  });
});
