// Phase 4: compare mode (FR035, FR036, AC019). The unit test proves the
// pathfinding; this proves the browser flow renders the explained path.
import { expect, test } from '@playwright/test';

test.describe('compare mode', () => {
  test('comparing two connected projects shows the explained path (AC019)', async ({
    page,
  }) => {
    await page.goto('/?p=meet-larry');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await expect(page.getByTestId('galaxy-panel')).toBeVisible();
    await page.getByTestId('panel-compare').click();
    await expect(page.getByTestId('compare-result')).toContainText(
      /SELECT A SECOND PROJECT/,
    );
    // Pick the second project via the command palette.
    await page.keyboard.press('/');
    await page.getByTestId('palette-input').fill('AI Infrastructure');
    await page.keyboard.press('Enter');
    const result = page.getByTestId('compare-result');
    await expect(result).toContainText(/PATH \/\/ 2 HOPS/);
    // Each hop carries its plain-language reason.
    await expect(result.locator('.galaxy-panel__path li')).toHaveCount(2);
    await expect(
      result.locator('.galaxy-panel__reason').first(),
    ).not.toBeEmpty();
  });

  test('clearing the comparison restores the panel (FR036)', async ({
    page,
  }) => {
    await page.goto('/?p=meet-larry');
    await page.waitForSelector('[data-map-state="online"]', {
      timeout: 15_000,
    });
    await page.getByTestId('panel-compare').click();
    await page.keyboard.press('/');
    await page.getByTestId('palette-input').fill('build your own larry');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('compare-result')).toContainText(/PATH/);
    await page.getByTestId('panel-compare').click();
    await expect(page.getByTestId('compare-result')).toBeHidden();
  });
});
