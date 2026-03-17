import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

const ITEMS_BASE = 'http://localhost:3002';
const USERS_BASE = 'http://localhost:3001';

async function createTestUser(request: any) {
  const email = `crud-${uuidv4()}@example.com`;
  const res = await request.post(`${USERS_BASE}/auth/register`, {
    data: { name: 'CRUD User', email, password: 'Pass123' },
  });
  const { token } = await res.json();
  return token;
}

test.describe('Items Service - CRUD', () => {
  test('GET /health returns ok', async ({ request }) => {
    const res = await request.get(`${ITEMS_BASE}/health`);
    expect(res.status()).toBe(200);
  });

  test('POST /items creates item', async ({ request }) => {
    const token = await createTestUser(request);
    const res = await request.post(`${ITEMS_BASE}/items`, {
      data: { title: 'Test item', category: 'work' },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeTruthy();
    expect(body.title).toBe('Test item');
    expect(body.done).toBe(false);
  });

  test('GET /items/:id returns item', async ({ request }) => {
    const token = await createTestUser(request);
    const created = await request.post(`${ITEMS_BASE}/items`, {
      data: { title: 'Get by ID', category: 'personal' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const item = await created.json();

    const res = await request.get(`${ITEMS_BASE}/items/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(item.id);
  });

  test('PUT /items/:id updates item', async ({ request }) => {
    const token = await createTestUser(request);
    const created = await request.post(`${ITEMS_BASE}/items`, {
      data: { title: 'Original', category: 'work' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const item = await created.json();

    const res = await request.put(`${ITEMS_BASE}/items/${item.id}`, {
      data: { title: 'Updated', done: true },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated');
    expect(body.done).toBe(true);
  });

  test('DELETE /items/:id removes item', async ({ request }) => {
    const token = await createTestUser(request);
    const created = await request.post(`${ITEMS_BASE}/items`, {
      data: { title: 'To delete', category: 'work' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const item = await created.json();

    const del = await request.delete(`${ITEMS_BASE}/items/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(del.status()).toBe(204);

    const get = await request.get(`${ITEMS_BASE}/items/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(get.status()).toBe(404);
  });

  test('POST /items/:id/toggle flips done status', async ({ request }) => {
    const token = await createTestUser(request);
    const created = await request.post(`${ITEMS_BASE}/items`, {
      data: { title: 'Toggle me', category: 'personal' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const item = await created.json();
    expect(item.done).toBe(false);

    const toggled = await request.post(`${ITEMS_BASE}/items/${item.id}/toggle`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(toggled.status()).toBe(200);
    const body = await toggled.json();
    expect(body.done).toBe(true);
  });

  test('GET /items/categories returns array', async ({ request }) => {
    const token = await createTestUser(request);
    const res = await request.get(`${ITEMS_BASE}/items/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toContain('work');
  });
});
