import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

const ITEMS_BASE = 'http://localhost:3002';
const USERS_BASE = 'http://localhost:3001';

test.describe('Items Service - Error scenarios', () => {
  let token: string;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    const email = `errors-${uuidv4()}@example.com`;
    const res = await request.post(`${USERS_BASE}/auth/register`, {
      data: { name: 'Error User', email, password: 'Pass123' },
    });
    const data = await res.json();
    token = data.token;
    await request.dispose();
  });

  test('POST /items returns 400 when title missing', async ({ request }) => {
    const res = await request.post(`${ITEMS_BASE}/items`, {
      data: { category: 'work' },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(400);
  });

  test('POST /items returns 400 for invalid category', async ({ request }) => {
    const res = await request.post(`${ITEMS_BASE}/items`, {
      data: { title: 'Bad category item', category: 'invalid-cat' },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(400);
  });

  test('GET /items/:id returns 404 for nonexistent item', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/items/${uuidv4()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(404);
  });

  test('DELETE /items/:id returns 404 for nonexistent item', async ({ request }) => {
    const res = await request.delete(`${ITEMS_BASE}/items/${uuidv4()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(404);
  });
});
