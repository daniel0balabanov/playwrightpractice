import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

test.describe('User Service - Auth', () => {
  test('GET /health returns ok', async ({ request }) => {
    const res = await request.get('/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('POST /auth/register creates user and returns token', async ({ request }) => {
    const email = `test-${uuidv4()}@example.com`;
    const res = await request.post('/auth/register', {
      data: { name: 'Alice', email, password: 'Secret123' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(email);
    expect(body.user.passwordHash).toBeUndefined();
  });

  test('POST /auth/register returns 409 for duplicate email', async ({ request }) => {
    const email = `dup-${uuidv4()}@example.com`;
    await request.post('/auth/register', {
      data: { name: 'Alice', email, password: 'Secret123' },
    });
    const res = await request.post('/auth/register', {
      data: { name: 'Bob', email, password: 'Secret456' },
    });
    expect(res.status()).toBe(409);
  });

  test('POST /auth/register returns 400 when fields missing', async ({ request }) => {
    const res = await request.post('/auth/register', {
      data: { email: 'no-name@example.com' },
    });
    expect(res.status()).toBe(400);
  });

  test('POST /auth/login returns token with valid credentials', async ({ request }) => {
    const email = `login-${uuidv4()}@example.com`;
    await request.post('/auth/register', {
      data: { name: 'Charlie', email, password: 'Pass123' },
    });
    const res = await request.post('/auth/login', {
      data: { email, password: 'Pass123' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toBeTruthy();
  });

  test('POST /auth/login returns 401 with wrong password', async ({ request }) => {
    const email = `badpass-${uuidv4()}@example.com`;
    await request.post('/auth/register', {
      data: { name: 'Dave', email, password: 'CorrectPass' },
    });
    const res = await request.post('/auth/login', {
      data: { email, password: 'WrongPass' },
    });
    expect(res.status()).toBe(401);
  });

  test('POST /auth/logout blacklists token', async ({ request }) => {
    const email = `logout-${uuidv4()}@example.com`;
    const reg = await request.post('/auth/register', {
      data: { name: 'Eve', email, password: 'Pass123' },
    });
    const { token } = await reg.json();

    const logout = await request.post('/auth/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(logout.status()).toBe(204);

    const me = await request.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me.status()).toBe(401);
  });
});
