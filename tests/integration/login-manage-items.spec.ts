import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('Integration - Login and manage items', () => {
  let email: string;
  let password: string;

  test.beforeAll(async ({ playwright }) => {
    email = `mgmt-${uuidv4()}@example.com`;
    password = 'MgmtPass123!';
    const request = await playwright.request.newContext({ baseURL: 'http://localhost:3001' });
    await request.post('/auth/register', {
      data: { name: 'Management User', email, password },
    });
    await request.dispose();
  });

  test('user can login and see items list', async ({ page }) => {
    await page.goto('/');
    await page.fill('#login-email', email);
    await page.fill('#login-password', password);
    await page.click('#login-submit');

    await expect(page.locator('#user-info')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#items-section')).toBeVisible();
  });

  test('user can filter items by category', async ({ page }) => {
    await page.goto('/');
    await page.fill('#login-email', email);
    await page.fill('#login-password', password);
    await page.click('#login-submit');
    await expect(page.locator('#user-info')).toBeVisible({ timeout: 10000 });

    await page.selectOption('#filter-category', 'work');
    await page.click('#apply-filter-btn');

    // All visible items should be work category
    const categoryBadges = page.locator('#items-list .item-category');
    const count = await categoryBadges.count();
    for (let i = 0; i < count; i++) {
      await expect(categoryBadges.nth(i)).toHaveText('work');
    }
  });
});
