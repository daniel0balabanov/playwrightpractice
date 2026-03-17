import { test, expect } from '@playwright/test';

test.describe('UI - Table & Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('table displays rows', async ({ page }) => {
    const rows = page.locator('#data-table tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('clicking column header changes sort', async ({ page }) => {
    const header = page.locator('#data-table th[data-sort]').first();
    await header.click();
    await expect(header).toHaveAttribute('aria-sort', /.+/);
  });

  test('pagination next button works', async ({ page }) => {
    const nextBtn = page.locator('#pagination-next');
    const initialPage = await page.locator('#current-page').textContent();
    await nextBtn.click();
    const newPage = await page.locator('#current-page').textContent();
    expect(newPage).not.toBe(initialPage);
  });

  test('load more button loads additional items', async ({ page }) => {
    const initialCount = await page.locator('#loadmore-list li').count();
    await page.click('#load-more-btn');
    const newCount = await page.locator('#loadmore-list li').count();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
