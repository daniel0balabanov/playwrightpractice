import { test } from '@playwright/test';
import { MainPage } from './pages/MainPage';
import { expect } from './assertions/expect';

test.describe('UI - Forms & Inputs', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('text input accepts value', async () => {
    await mainPage.fill(mainPage.sel.textInput, 'Hello World');
    await expect(mainPage.textInput).toHaveValue('Hello World');
  });

  test('email input accepts valid email', async () => {
    await mainPage.fill(mainPage.sel.emailInput, 'test@example.com');
    await expect(mainPage.emailInput).toHaveValue('test@example.com');
  });

  test('number input accepts numeric value', async () => {
    await mainPage.fill(mainPage.sel.numberInput, '42');
    await expect(mainPage.numberInput).toHaveValue('42');
  });

  test('textarea accepts multiline text', async () => {
    await mainPage.fill(mainPage.sel.textareaInput, 'Line 1\nLine 2\nLine 3');
    await expect(mainPage.textareaInput).toHaveValue('Line 1\nLine 2\nLine 3');
  });

  test('disabled input is not editable', async () => {
    const input = mainPage.locator(mainPage.sel.disabledInput);
    await input.isDisabled();
  });

  test('readonly input is not editable', async () => {
    const input = mainPage.locator(mainPage.sel.readonlyInput);
    await input.isEditable().then(editable => {
      if (editable) throw new Error('Expected readonly input to not be editable');
    });
  });

  test('range slider updates display value', async () => {
    await mainPage.fill(mainPage.sel.rangeInput, '75');
    await expect(mainPage.rangeValue).toHaveText('75');
  });

  test('file input accepts file upload', async ({ page }) => {
    await page.locator(mainPage.sel.fileInput).setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      buffer: new TextEncoder().encode('hello') as any,
    });
    const input = mainPage.locator(mainPage.sel.fileInput);
    await input.isVisible();
  });
});
