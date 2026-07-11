// Motion evidence gates (operating law: a single screenshot is never proof
// of motion). Ordered frame sequences, saved as artifacts, with pixel-diff
// assertions in both directions: full mode must MOVE (AC009 family), reduced
// motion must NOT (AC010). Plus the 1.5s interactive envelope and the
// AC038 hidden-pause check.
import { expect, test, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import { mkdirSync } from 'node:fs';

const FRAME_DIR = 'test-results/motion-frames';

function diffRatio(a: Buffer, b: Buffer): number {
  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  if (pa.width !== pb.width || pa.height !== pb.height) return 1;
  let diff = 0;
  const total = pa.width * pa.height;
  for (let i = 0; i < pa.data.length; i += 4) {
    const d =
      Math.abs(pa.data[i]! - pb.data[i]!) +
      Math.abs(pa.data[i + 1]! - pb.data[i + 1]!) +
      Math.abs(pa.data[i + 2]! - pb.data[i + 2]!);
    if (d > 24) diff++;
  }
  return diff / total;
}

async function captureFrames(
  page: Page,
  label: string,
  count: number,
  intervalMs: number,
): Promise<Buffer[]> {
  mkdirSync(FRAME_DIR, { recursive: true });
  const frames: Buffer[] = [];
  for (let i = 0; i < count; i++) {
    const shot = await page.screenshot({
      path: `${FRAME_DIR}/${label}-${i}.png`,
    });
    frames.push(shot);
    if (i < count - 1) await page.waitForTimeout(intervalMs);
  }
  return frames;
}

test.describe('motion evidence', () => {
  test('full mode: ordered frames prove continuous motion (AC009 evidence)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    const frames = await captureFrames(page, 'full-motion', 5, 400);
    let movingPairs = 0;
    for (let i = 1; i < frames.length; i++) {
      if (diffRatio(frames[i - 1]!, frames[i]!) > 0.001) movingPairs++;
    }
    // Drift, pulses, and signals must actually move the sky between frames.
    expect(
      movingPairs,
      'expected a majority of consecutive frame pairs to differ in full motion mode',
    ).toBeGreaterThanOrEqual(3);
  });

  test('reduced motion: ordered frames prove stillness (AC010)', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    // Let any settle complete, then require the sky to hold still.
    await page.waitForTimeout(800);
    const frames = await captureFrames(page, 'reduced-motion', 4, 400);
    for (let i = 1; i < frames.length; i++) {
      expect(
        diffRatio(frames[i - 1]!, frames[i]!),
        `frames ${i - 1} and ${i} differ under reduced motion`,
      ).toBeLessThan(0.0005);
    }
    await context.close();
  });

  test('interactive within the 1.5 second envelope (AC009)', async ({
    page,
  }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForSelector('[data-testid="galaxy-skip"]:visible', {
      timeout: 15_000,
    });
    const skipVisibleAt = Date.now() - start;
    // The SKIP control is the entrance's own interactivity proof; the shell
    // links are static HTML and interactive even earlier.
    expect(
      skipVisibleAt,
      `SKIP control took ${skipVisibleAt}ms to become available`,
    ).toBeLessThan(1500);
    await page.getByTestId('galaxy-skip').click();
  });

  test('renderer pauses when the document is hidden (AC038)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    const rafWhileHidden = await page.evaluate(async () => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => 'hidden',
      });
      document.dispatchEvent(new Event('visibilitychange'));
      await new Promise((r) => setTimeout(r, 120));
      let calls = 0;
      const orig = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb) => {
        calls++;
        return orig.call(window, cb);
      };
      await new Promise((r) => setTimeout(r, 600));
      window.requestAnimationFrame = orig;
      return calls;
    });
    expect(
      rafWhileHidden,
      'render loop kept scheduling frames while hidden',
    ).toBe(0);
    const rafAfterResume = await page.evaluate(async () => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => 'visible',
      });
      document.dispatchEvent(new Event('visibilitychange'));
      await new Promise((r) => setTimeout(r, 120));
      let calls = 0;
      const orig = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb) => {
        calls++;
        return orig.call(window, cb);
      };
      await new Promise((r) => setTimeout(r, 600));
      window.requestAnimationFrame = orig;
      return calls;
    });
    expect(
      rafAfterResume,
      'render loop did not resume after visibility returned',
    ).toBeGreaterThan(10);
  });
});
