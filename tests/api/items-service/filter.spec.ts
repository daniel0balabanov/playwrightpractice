import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

const ITEMS_BASE = 'http://localhost:3002';
const USERS_BASE = 'http://localhost:3001';

test.describe('Items Service - Filtering & Pagination', () => {
  let token: string;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    const email = `filter-${uuidv4()}@example.com`;
    const res = await request.post(`${USERS_BASE}/auth/register`, {
      data: { name: 'Filter User', email, password: 'Pass123' },
    });
    const data = await res.json();
    token = data.token;
    await request.dispose();
  });

  test('GET /items returns paginated results', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/items?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.meta.page).toBe(1);
    expect(body.meta.limit).toBe(5);
    expect(body.data.length).toBeLessThanOrEqual(5);
  });

  test('GET /items filters by category', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/items?category=work`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (const item of body.data) {
      expect(item.category).toBe('work');
    }
  });

  test('GET /items filters by done=true', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/items?done=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (const item of body.data) {
      expect(item.done).toBe(true);
    }
  });

  test('GET /items filters by search term', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/items?search=grocery`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (const item of body.data) {
      expect(item.title.toLowerCase()).toContain('grocery');
    }
  });

  test('GET /items returns correct meta for total pages', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/items?limit=3`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect(body.meta.totalPages).toBe(Math.ceil(body.meta.total / 3));
  });
});
