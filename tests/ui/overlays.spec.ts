import { test } from '@playwright/test';
import { MainPage } from './pages/MainPage';

test.describe('UI - Overlays: Modal & Toast', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('modal opens and closes', async () => {
    await mainPage.openModal();
    await mainPage.assertVisible(mainPage.sel.demoModal);
    await mainPage.closeModal();
    await mainPage.assertHidden(mainPage.sel.demoModal);
  });

  test('toast notification appears and disappears', async () => {
    await mainPage.showToast();
    await mainPage.assertVisible(mainPage.sel.toast);
    await mainPage.waitForHidden(mainPage.sel.toast);
  });

  test('tooltip is visible on hover', async () => {
    await mainPage.hover(mainPage.sel.tooltipTrigger);
    await mainPage.assertVisible(mainPage.sel.tooltip);
  });

  test('progress bar reaches 100%', async () => {
    await mainPage.startProgress();
    await mainPage.waitForProgressComplete();
    await mainPage.assertAttribute(mainPage.sel.progressBar, 'aria-valuenow', '100');
  });
});
