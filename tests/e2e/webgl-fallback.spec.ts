// AC022 gate: WebGL failure automatically falls back to the accessible
// content, and three.js is never fetched when it does (FR052, FR061).
import { expect, test } from '@playwright/test';

test.describe('WebGL fallback', () => {
  test('forced WebGL failure shows the fallback with no three.js request (AC022)', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (
          this: HTMLCanvasElement,
          type: string,
          ...rest: unknown[]
        ) => unknown;
      };
      const original = proto.getContext;
      proto.getContext = function patchedGetContext(
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) {
        if (
          type === 'webgl2' ||
          type === 'webgl' ||
          type === 'experimental-webgl'
        ) {
          return null;
        }
        return original.apply(this, [type, ...rest]);
      };
    });

    const requests: string[] = [];
    page.on('request', (req) => requests.push(req.url()));

    await page.goto('/');

    const fallback = page.locator('#galaxy-fallback');
    await expect(fallback).toBeVisible();
    await expect(page.locator('#galaxy-stage')).toHaveAttribute(
      'data-map-state',
      'fallback',
    );
    await expect(
      fallback.getByRole('link', { name: /open the atlas/i }),
    ).toHaveAttribute('href', '/atlas/');

    const vizRequests = requests.filter((u) => u.includes('three-viz'));
    expect(vizRequests).toEqual([]);
  });

  test('the always-visible ATLAS control still works when WebGL fails', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (
          this: HTMLCanvasElement,
          type: string,
          ...rest: unknown[]
        ) => unknown;
      };
      const original = proto.getContext;
      proto.getContext = function patchedGetContext(
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) {
        if (
          type === 'webgl2' ||
          type === 'webgl' ||
          type === 'experimental-webgl'
        ) {
          return null;
        }
        return original.apply(this, [type, ...rest]);
      };
    });

    await page.goto('/');
    await page.getByTestId('galaxy-atlas-link').click();
    await expect(page).toHaveURL(/\/atlas\//);
  });
});
