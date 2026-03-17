import { test, expect } from '@playwright/test';

test.describe('UI - Forms & Inputs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('text input accepts value', async ({ page }) => {
    const input = page.locator('#text-input');
    await input.fill('Hello World');
    await expect(input).toHaveValue('Hello World');
  });

  test('email input accepts valid email', async ({ page }) => {
    const input = page.locator('#email-input');
    await input.fill('test@example.com');
    await expect(input).toHaveValue('test@example.com');
  });

  test('number input accepts numeric value', async ({ page }) => {
    const input = page.locator('#number-input');
    await input.fill('42');
    await expect(input).toHaveValue('42');
  });

  test('textarea accepts multiline text', async ({ page }) => {
    const textarea = page.locator('#textarea-input');
    await textarea.fill('Line 1\nLine 2\nLine 3');
    await expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
  });

  test('disabled input is not editable', async ({ page }) => {
    const input = page.locator('#disabled-input');
    await expect(input).toBeDisabled();
  });

  test('readonly input is not editable', async ({ page }) => {
    const input = page.locator('#readonly-input');
    await expect(input).not.toBeEditable();
  });

  test('range slider updates display value', async ({ page }) => {
    const slider = page.locator('#range-input');
    await slider.fill('75');
    const display = page.locator('#range-value');
    await expect(display).toHaveText('75');
  });

  test('file input accepts file upload', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello'),
    });
    await expect(fileInput).not.toBeEmpty();
  });
});
