import { test, expect } from '@playwright/test';

test.describe('User Service - Error scenarios', () => {
  test('returns 401 with no auth header', async ({ request }) => {
    const res = await request.get('/users/me');
    expect(res.status()).toBe(401);
  });

  test('returns 401 with malformed token', async ({ request }) => {
    const res = await request.get('/users/me', {
      headers: { Authorization: 'Bearer not.a.real.token' },
    });
    expect(res.status()).toBe(401);
  });

  test('returns 401 with completely invalid auth header', async ({ request }) => {
    const res = await request.get('/users/me', {
      headers: { Authorization: 'Basic somebase64' },
    });
    expect(res.status()).toBe(401);
  });
});
