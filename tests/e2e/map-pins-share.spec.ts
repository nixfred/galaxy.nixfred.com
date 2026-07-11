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
    browserName,
  }) => {
    // clipboard-write is a Chromium-only permission name; WebKit rejects it.
    // Grant where supported, and assert the visible UI feedback everywhere.
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {
      // WebKit: no grantable clipboard permission; the UI feedback below is
      // the browser-agnostic proof, and the URL itself is the shared value.
    }
    await page.goto('/?p=the-code-audit');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    // The deep link that Share copies is the current URL (FR060, FR020).
    expect(page.url()).toContain('?p=the-code-audit');
    await page.getByTestId('panel-share').click();
    // UI feedback confirms the action fired (Copied on success, or the manual
    // fallback when the clipboard API is blocked): browser-agnostic proof.
    await expect(page.getByTestId('panel-share')).toHaveText(
      /Copied|Copy from address bar/,
    );
    if (browserName === 'chromium') {
      const clip = await page.evaluate(() => navigator.clipboard.readText());
      expect(clip).toContain('?p=the-code-audit');
    }
  });
});
