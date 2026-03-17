import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('Integration - Register and create item', () => {
  test('user can register, login, and create an item', async ({ page }) => {
    const email = `int-${uuidv4()}@example.com`;
    const password = 'IntTest123!';

    await page.goto('/');

    // Register
    await page.click('#show-register-btn');
    await page.fill('#register-name', 'Integration User');
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.click('#register-submit');

    // Wait for authenticated state
    await expect(page.locator('#user-info')).toBeVisible({ timeout: 10000 });

    // Create item
    await page.fill('#new-item-title', 'Integration Test Item');
    await page.selectOption('#new-item-category', 'work');
    await page.click('#create-item-btn');

    // Item should appear in the list
    await expect(page.locator('#items-list')).toContainText('Integration Test Item');
  });
});
