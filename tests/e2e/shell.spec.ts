// Phase 1 shell contract: FR001 (usable HTML), FR004/F32 (version always
// visible), FR002/F33 (permanent nixfred.com and repo links, every page).
import { expect, test } from '@playwright/test';

test.describe('shell', () => {
  test('renders the boot shell with real content (FR001)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NIXFRED GALAXY/);
    await expect(page.getByTestId('boot-line')).toContainText('NIXFRED GALAXY');
    await expect(
      page.getByRole('heading', { name: /every project/i }),
    ).toBeVisible();
  });

  test('version is visible at all times (F32, FR004)', async ({ page }) => {
    await page.goto('/');
    const version = page.getByTestId('build-version');
    await expect(version).toBeVisible();
    await expect(version).not.toBeEmpty();
  });

  test('permanent links present: nixfred.com and the repo (F33, FR002)', async ({
    page,
  }) => {
    await page.goto('/');
    const home = page.locator('footer a[href="https://nixfred.com"]');
    const repo = page.getByTestId('repo-link');
    await expect(home).toBeVisible();
    await expect(repo).toBeVisible();
    await expect(repo).toHaveAttribute(
      'href',
      'https://github.com/nixfred/galaxy.nixfred.com',
    );
  });

  test('skip link reaches main content (AR002)', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
  });
});
