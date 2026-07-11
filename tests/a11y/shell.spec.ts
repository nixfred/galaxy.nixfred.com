// AC025 / AR010 gate: zero serious or critical axe violations.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoSeriousOrCriticalViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const blocking = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact ?? ''),
  );
  expect(
    blocking,
    blocking.map((v) => `${v.id}: ${v.description}`).join('\n'),
  ).toEqual([]);
}

test.describe('accessibility', () => {
  test('home page has zero serious or critical violations (AC025)', async ({
    page,
  }) => {
    await page.goto('/');
    await expectNoSeriousOrCriticalViolations(page);
  });

  test('home page canvas is aria-hidden and map controls are labeled (AR008)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('#galaxy-canvas')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(page.getByTestId('galaxy-atlas-link')).toHaveAccessibleName(
      /atlas/i,
    );
    await expect(page.getByTestId('galaxy-pause')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId('galaxy-pause')).toHaveAccessibleName(
      /pause/i,
    );
    await expectNoSeriousOrCriticalViolations(page);
  });

  test('atlas page has zero serious or critical violations (AC025)', async ({
    page,
  }) => {
    await page.goto('/atlas/');
    await expectNoSeriousOrCriticalViolations(page);
  });

  test('a project page has zero serious or critical violations (AC025)', async ({
    page,
  }) => {
    await page.goto('/project/meet-larry/');
    await expectNoSeriousOrCriticalViolations(page);
  });

  test('404 page has zero serious or critical violations (AC025)', async ({
    page,
  }) => {
    await page.goto('/404.html');
    await expectNoSeriousOrCriticalViolations(page);
  });
});
