import { test, expect } from '@playwright/test';
import { MainPage } from './pages/MainPage';

test.describe('UI - Selects & Toggles', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('native select changes value', async () => {
    await mainPage.selectOption(mainPage.sel.nativeSelect, 'option2');
    await mainPage.assertValue(mainPage.sel.nativeSelect, 'option2');
  });

  test('multi-select allows multiple selections', async () => {
    await mainPage.selectOption(mainPage.sel.multiSelect, ['opt1', 'opt2']);
    const values = await mainPage.locator(mainPage.sel.multiSelect).evaluate(
      (el: HTMLSelectElement) => Array.from(el.selectedOptions).map(o => o.value)
    );
    expect(values).toContain('opt1');
    expect(values).toContain('opt2');
  });

  test('checkbox can be checked and unchecked', async () => {
    await mainPage.check(mainPage.sel.checkbox1);
    await mainPage.assertChecked(mainPage.sel.checkbox1);
    await mainPage.uncheck(mainPage.sel.checkbox1);
    const checked = await mainPage.isChecked(mainPage.sel.checkbox1);
    expect(checked).toBe(false);
  });

  test('radio group allows single selection', async () => {
    await mainPage.check(mainPage.sel.radioB);
    await mainPage.assertChecked(mainPage.sel.radioB);
    const aChecked = await mainPage.isChecked(mainPage.sel.radioA);
    expect(aChecked).toBe(false);
  });

  test('toggle switch can be toggled', async () => {
    const initialState = await mainPage.isChecked(mainPage.sel.toggleSwitch);
    await mainPage.click(mainPage.sel.toggleSwitch);
    const newState = await mainPage.isChecked(mainPage.sel.toggleSwitch);
    expect(newState).toBe(!initialState);
  });
});
