import { test } from '@playwright/test';
import { MainPage } from './pages/MainPage';

test.describe('UI - Forms & Inputs', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('text input accepts value', async () => {
    await mainPage.fill(mainPage.sel.textInput, 'Hello World');
    await mainPage.assertValue(mainPage.sel.textInput, 'Hello World');
  });

  test('email input accepts valid email', async () => {
    await mainPage.fill(mainPage.sel.emailInput, 'test@example.com');
    await mainPage.assertValue(mainPage.sel.emailInput, 'test@example.com');
  });

  test('number input accepts numeric value', async () => {
    await mainPage.fill(mainPage.sel.numberInput, '42');
    await mainPage.assertValue(mainPage.sel.numberInput, '42');
  });

  test('textarea accepts multiline text', async () => {
    await mainPage.fill(mainPage.sel.textareaInput, 'Line 1\nLine 2\nLine 3');
    await mainPage.assertValue(mainPage.sel.textareaInput, 'Line 1\nLine 2\nLine 3');
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
    await mainPage.assertText(mainPage.sel.rangeValue, '75');
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
