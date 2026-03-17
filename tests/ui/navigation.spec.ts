import { test, expect } from '@playwright/test';

test.describe('UI - Navigation: Tabs & Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking a tab shows correct panel', async ({ page }) => {
    await page.click('[role="tab"][data-tab="tab2"]');
    await expect(page.locator('#tab-panel-2')).toBeVisible();
    await expect(page.locator('#tab-panel-1')).not.toBeVisible();
  });

  test('accordion expands and collapses', async ({ page }) => {
    const details = page.locator('#accordion-1');
    // Ensure closed
    await expect(details).not.toHaveAttribute('open');
    await page.click('#accordion-1 summary');
    await expect(details).toHaveAttribute('open', '');
    await page.click('#accordion-1 summary');
    await expect(details).not.toHaveAttribute('open');
  });

  test('keyboard navigation moves between tabs', async ({ page }) => {
    await page.click('[role="tab"][data-tab="tab1"]');
    await page.keyboard.press('ArrowRight');
    const focused = page.locator('[role="tab"]:focus');
    await expect(focused).toBeVisible();
  });
});
