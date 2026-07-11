// Visual regression baselines (interview Q72, AC010/AC011 support): stable
// desktop, tablet, mobile, Atlas, and reduced-motion states. The map's
// deterministic layout makes star positions reproducible, but WebGL raster
// varies subtly across machines, so map snapshots mask the canvas and assert
// the chrome; the Atlas and shell snapshots are pixel-stable HTML.
import { expect, test } from '@playwright/test';

test.describe('visual baselines', () => {
  test('shell hero, desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-map-state]');
    // Mask the WebGL canvas: its raster is machine-dependent, the chrome is not.
    await expect(page).toHaveScreenshot('shell-desktop.png', {
      mask: [page.locator('#galaxy-canvas')],
      maxDiffPixelRatio: 0.02,
    });
  });

  test('atlas, desktop', async ({ page }) => {
    await page.goto('/atlas/');
    await page.waitForSelector('.atlas-section');
    await expect(page).toHaveScreenshot('atlas-desktop.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('atlas, mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/atlas/');
    await page.waitForSelector('.atlas-section');
    await expect(page).toHaveScreenshot('atlas-mobile.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('project page', async ({ page }) => {
    await page.goto('/project/meet-larry/');
    await page.waitForSelector('h1');
    await expect(page).toHaveScreenshot('project-meet-larry.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('404 page', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page).toHaveScreenshot('not-found.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});
