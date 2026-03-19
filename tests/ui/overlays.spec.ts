import { test } from '@playwright/test';
import { MainPage } from './pages/MainPage';
import { expect } from './assertions/expect';

test.describe('UI - Overlays: Modal & Toast', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('modal opens and closes', async () => {
    await mainPage.openModal();
    await expect(mainPage.demoModal).toBeVisible();
    await mainPage.closeModal();
    await expect(mainPage.demoModal).toBeHidden();
  });

  test('toast notification appears and disappears', async () => {
    await mainPage.showToast();
    await expect(mainPage.toast).toBeVisible();
    await mainPage.waitForHidden(mainPage.sel.toast);
  });

  test('tooltip is visible on hover', async () => {
    await mainPage.hover(mainPage.sel.tooltipTrigger);
    await expect(mainPage.tooltip).toBeVisible();
  });

  test('progress bar reaches 100%', async () => {
    await mainPage.startProgress();
    await mainPage.waitForProgressComplete();
    await expect(mainPage.progressBar).toHaveAttribute('aria-valuenow', '100');
  });
});
