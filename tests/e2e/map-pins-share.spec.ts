// Phase 4: session pins (FR057, FR058) and share (FR060).
import { expect, test } from '@playwright/test';

test.describe('pins and share', () => {
  test('pinning a project toggles and persists in session only (FR057, FR058)', async ({
    page,
  }) => {
    await page.goto('/?p=meet-larry');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    const pin = page.getByTestId('panel-pin');
    await expect(pin).toHaveAttribute('aria-pressed', 'false');
    await pin.click();
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    await expect(pin).toHaveText('Pinned');
    // Persists in sessionStorage, never a cookie or account (FR058).
    const stored = await page.evaluate(() =>
      sessionStorage.getItem('galaxy-pins'),
    );
    expect(stored).toContain('meet-larry');
    const cookies = await page.context().cookies();
    expect(cookies).toHaveLength(0);
  });

  test('share copies the stable deep link (FR060)', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/?p=the-code-audit');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await page.getByTestId('panel-share').click();
    await expect(page.getByTestId('panel-share')).toHaveText('Copied');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain('?p=the-code-audit');
  });
});
