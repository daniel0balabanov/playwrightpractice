import { test, expect } from '@playwright/test';

test.describe('UI - Overlays: Modal & Toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('modal opens and closes', async ({ page }) => {
    await page.click('#open-modal-btn');
    const dialog = page.locator('#demo-modal');
    await expect(dialog).toBeVisible();
    await page.click('#close-modal-btn');
    await expect(dialog).not.toBeVisible();
  });

  test('toast notification appears and disappears', async ({ page }) => {
    await page.click('#show-toast-btn');
    const toast = page.locator('#toast-container .toast');
    await expect(toast).toBeVisible();
    await expect(toast).toBeHidden({ timeout: 5000 });
  });

  test('tooltip is visible on hover', async ({ page }) => {
    await page.hover('#tooltip-trigger');
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
  });

  test('progress bar reaches 100%', async ({ page }) => {
    await page.click('#start-progress-btn');
    const progressBar = page.locator('[role="progressbar"]');
    await page.waitForFunction(() => {
      const bar = document.querySelector('[role="progressbar"]');
      return bar && parseInt(bar.getAttribute('aria-valuenow') || '0') >= 100;
    }, { timeout: 10000 });
    await expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });
});
