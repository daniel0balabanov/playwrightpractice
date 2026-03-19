import { test } from '@playwright/test';
import { MainPage } from './pages/MainPage';
import { expect } from './assertions/expect';

test.describe('UI - Advanced: Drag & Drop, iFrame', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('drag and drop reorders items', async () => {
    await mainPage.dragItemToZone(mainPage.sel.dragItem1);
    const dropped = mainPage.locator(`${mainPage.sel.dragZone} ${mainPage.sel.draggableItems}`);
    await dropped.isVisible();
  });

  test('iframe nested form submits', async () => {
    const frame = mainPage.getIframeLocator();
    await frame.locator('#iframe-name').fill('Playwright Test');
    await frame.locator('#iframe-submit').click();
    await expect(frame.locator('#iframe-result')).toHaveText('Submitted: Playwright Test');
  });

  test('loading skeleton is shown then hidden', async () => {
    const count = await mainPage.getCount('.skeleton');
    expect(count).toBeGreaterThan(0);
  });
});
