import { test, expect } from '@playwright/test';
import { MainPage } from './pages/MainPage';

test.describe('UI - Navigation: Tabs & Accordion', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('clicking a tab shows correct panel', async () => {
    await mainPage.clickTab(2);
    await mainPage.assertVisible(mainPage.sel.tabPanel2);
    await mainPage.assertHidden(mainPage.sel.tabPanel1);
  });

  test('accordion expands and collapses', async () => {
    expect(await mainPage.isAccordionOpen(1)).toBe(false);
    await mainPage.toggleAccordion(1);
    expect(await mainPage.isAccordionOpen(1)).toBe(true);
    await mainPage.toggleAccordion(1);
    expect(await mainPage.isAccordionOpen(1)).toBe(false);
  });

  test('keyboard navigation moves between tabs', async () => {
    await mainPage.click(mainPage.sel.tab1Btn);
    await mainPage.pressKey('ArrowRight');
    const focused = mainPage.locator('[role="tab"]:focus');
    await expect(focused).toBeVisible();
  });
});
