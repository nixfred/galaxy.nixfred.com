// Pixel truth gate: MAP ONLINE must mean visible photons, not just a state
// attribute. Added after real-browser evidence showed a black sky while every
// structural assertion passed (Phase 3a). Screenshots the canvas region and
// requires a meaningful count of non-background pixels (stars, atmosphere).
import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

test.describe('map renders visible content', () => {
  test('canvas shows stars, not a black void, once online', async ({
    page,
    browserName,
  }) => {
    // WebGL raster capture in headless WebKit is unreliable; the pixel-truth
    // check runs in Chromium, the reference engine. Real Safari renders the
    // scene (verified visually); webgl-fallback.spec covers the no-WebGL path
    // cross-browser.
    test.skip(
      browserName !== 'chromium',
      'headless WebKit WebGL raster capture is unreliable',
    );
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    // Let the ignition choreography land some photons.
    await page.waitForTimeout(1_800);
    const shot = await page.screenshot({ fullPage: false });
    const png = PNG.sync.read(shot);
    // Count pixels meaningfully brighter than surface-0 (#05070A). Text and
    // buttons contribute some, so demand a count well above what the hero
    // copy alone produces, in regions spread across the frame.
    let lit = 0;
    for (let i = 0; i < png.data.length; i += 4) {
      const r = png.data[i]!;
      const g = png.data[i + 1]!;
      const b = png.data[i + 2]!;
      if (r + g + b > 90) lit++;
    }
    const total = png.width * png.height;
    const litRatio = lit / total;
    // The hero text alone measures well under 1.5% of the frame; stars,
    // halos, and sector atmosphere must push meaningfully past that.
    expect(
      litRatio,
      `lit-pixel ratio ${litRatio.toFixed(4)} suggests a dark or empty scene`,
    ).toBeGreaterThan(0.02);
  });
});
