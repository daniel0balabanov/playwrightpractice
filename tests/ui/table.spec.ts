import { test } from '@playwright/test';
import { MainPage } from './pages/MainPage';
import { expect } from './assertions/expect';

test.describe('UI - Table & Pagination', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('table displays rows', async () => {
    const rows = mainPage.locator(mainPage.sel.tableRows);
    await rows.first().isVisible();
  });

  test('clicking column header changes sort', async () => {
    await mainPage.sortTableBy('title');
    const header = mainPage.locator(`${mainPage.sel.tableSortHeaders}[data-sort="title"]`);
    await expect(header).toHaveAttribute('aria-sort', /.+/);
  });

  test('pagination next button works', async () => {
    const initialPage = await mainPage.getText(mainPage.sel.currentPage);
    await mainPage.goToNextTablePage();
    const newPage = await mainPage.getText(mainPage.sel.currentPage);
    expect(newPage).not.toBe(initialPage);
  });

  test('load more button loads additional items', async () => {
    const initialCount = await mainPage.getLoadmoreItemCount();
    await mainPage.loadMore();
    const newCount = await mainPage.getLoadmoreItemCount();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
