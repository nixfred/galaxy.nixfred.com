// G3 check 7 machinery: frame budget (PR010 instrumented floor) and bounded
// memory (no unbounded allocation during animation). CI runs this 60 second
// mini-soak on every push; the full ten minute soak is executed at gate time
// and its evidence recorded in the gate commit (docs/GATES.md PR010 row:
// WARN instrumented floor here, MANUAL reference-device confirmation at G5).
import { expect, test } from '@playwright/test';

test.describe('frame budget and memory', () => {
  test('sustains the instrumented frame rate floor on desktop settings', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await page.waitForTimeout(1_500);
    const fps = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let frames = 0;
          const start = performance.now();
          function tick(): void {
            frames++;
            if (performance.now() - start < 5_000) requestAnimationFrame(tick);
            else resolve((frames * 1000) / (performance.now() - start));
          }
          requestAnimationFrame(tick);
        }),
    );
    // Headless CI runners are not the reference device (F29 owns the real
    // 60fps bar at G5); 30 is the do-not-ship floor on any profile.
    expect(fps, `measured ${fps.toFixed(1)} fps`).toBeGreaterThan(30);
    console.log(`frame rate: ${fps.toFixed(1)} fps over 5s`);
  });

  test('memory stays bounded across a 60 second animated soak', async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    const samples: number[] = [];
    for (let i = 0; i < 7; i++) {
      const heap = await page.evaluate(() => {
        const m = (
          performance as unknown as {
            memory?: { usedJSHeapSize: number };
          }
        ).memory;
        return m ? m.usedJSHeapSize : -1;
      });
      samples.push(heap);
      if (i < 6) await page.waitForTimeout(10_000);
    }
    test.skip(samples[0] === -1, 'performance.memory unavailable');
    const first = samples[1]!; // ignore warmup sample
    const last = samples[samples.length - 1]!;
    const growth = (last - first) / first;
    console.log(
      `heap samples MB: ${samples.map((s) => (s / 1048576).toFixed(1)).join(', ')}`,
    );
    // Steady-state animation must not accumulate: allow modest jitter, block
    // monotonic growth (zero per-frame allocation discipline, craft doc 9).
    expect(
      growth,
      `heap grew ${(growth * 100).toFixed(1)}% during the soak`,
    ).toBeLessThan(0.25);
  });
});
