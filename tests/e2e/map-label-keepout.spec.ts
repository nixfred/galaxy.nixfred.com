// WC03/WC10 regression: star labels must not collide with the hero copy.
// Found by the world-class rubric review (labels bled through the hero text
// on the home page); this locks the keep-out fix.
import { expect, test } from '@playwright/test';

test.describe('label keep-out over hero copy', () => {
  test('no visible star label overlaps the hero text box', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await page.waitForTimeout(1200);
    const overlaps = await page.evaluate(() => {
      // WC03 is about the reading text specifically, not the shell column's
      // empty gutters: labels sitting in the gutter beside the copy are fine.
      const textEls = ['h1', '.hero-support', '.boot-line', '.site-name']
        .map((s) => document.querySelector(s))
        .filter((e): e is Element => e !== null)
        .map((e) => e.getBoundingClientRect());
      const labels = Array.from(
        document.querySelectorAll<HTMLElement>('.galaxy-label'),
      ).filter((l) => l.style.display !== 'none');
      let hits = 0;
      for (const label of labels) {
        if (label.classList.contains('galaxy-label--selected')) continue;
        const r = label.getBoundingClientRect();
        for (const t of textEls) {
          if (
            r.left < t.right &&
            r.right > t.left &&
            r.top < t.bottom &&
            r.bottom > t.top
          ) {
            hits++;
            break;
          }
        }
      }
      return hits;
    });
    expect(overlaps, `${overlaps} labels overlap the hero copy`).toBe(0);
  });
});
