import { test, expect } from '@playwright/test';

test.describe('UI - Selects & Toggles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('native select changes value', async ({ page }) => {
    await page.selectOption('#native-select', 'option2');
    await expect(page.locator('#native-select')).toHaveValue('option2');
  });

  test('multi-select allows multiple selections', async ({ page }) => {
    await page.selectOption('#multi-select', ['opt1', 'opt2']);
    const values = await page.locator('#multi-select').evaluate((el: HTMLSelectElement) =>
      Array.from(el.selectedOptions).map(o => o.value)
    );
    expect(values).toContain('opt1');
    expect(values).toContain('opt2');
  });

  test('checkbox can be checked and unchecked', async ({ page }) => {
    const checkbox = page.locator('#checkbox-1');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('radio group allows single selection', async ({ page }) => {
    await page.locator('#radio-b').check();
    await expect(page.locator('#radio-b')).toBeChecked();
    await expect(page.locator('#radio-a')).not.toBeChecked();
  });

  test('toggle switch can be toggled', async ({ page }) => {
    const toggle = page.locator('#toggle-switch');
    const initialState = await toggle.isChecked();
    await toggle.click();
    expect(await toggle.isChecked()).toBe(!initialState);
  });
});
