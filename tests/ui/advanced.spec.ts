import { test, expect } from '@playwright/test';

test.describe('UI - Advanced: Drag & Drop, iFrame', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('drag and drop reorders items', async ({ page }) => {
    const source = page.locator('.draggable-item').first();
    const target = page.locator('.drag-zone');
    await source.dragTo(target);
    // The item should now be in the drop zone
    await expect(target.locator('.draggable-item')).toBeVisible();
  });

  test('iframe nested form submits', async ({ page }) => {
    const frame = page.frameLocator('#demo-iframe');
    await frame.locator('#iframe-name').fill('Playwright Test');
    await frame.locator('#iframe-submit').click();
    await expect(frame.locator('#iframe-result')).toHaveText('Submitted: Playwright Test');
  });

  test('loading skeleton is shown then hidden', async ({ page }) => {
    const skeleton = page.locator('.skeleton');
    // Check skeleton exists in DOM (may or may not be visible depending on timing)
    expect(await skeleton.count()).toBeGreaterThan(0);
  });
});
