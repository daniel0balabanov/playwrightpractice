import { test, expect } from '../../fixtures/auth.fixture';

test.describe('User Service - Profile', () => {
  test('GET /users/me returns current user', async ({ request, authUser }) => {
    const res = await request.get('/users/me', {
      headers: { Authorization: `Bearer ${authUser.token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(authUser.user.id);
    expect(body.passwordHash).toBeUndefined();
  });

  test('PUT /users/me updates name', async ({ request, authUser }) => {
    const res = await request.put('/users/me', {
      data: { name: 'Updated Name' },
      headers: { Authorization: `Bearer ${authUser.token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Updated Name');
  });

  test('PUT /users/me/password succeeds with correct current password', async ({ request, authUser }) => {
    const res = await request.put('/users/me/password', {
      data: { currentPassword: authUser.password, newPassword: 'NewPass456!' },
      headers: { Authorization: `Bearer ${authUser.token}` },
    });
    expect(res.status()).toBe(200);
  });

  test('PUT /users/me/password returns 401 with wrong current password', async ({ request, authUser }) => {
    const res = await request.put('/users/me/password', {
      data: { currentPassword: 'WrongCurrent', newPassword: 'NewPass456!' },
      headers: { Authorization: `Bearer ${authUser.token}` },
    });
    expect(res.status()).toBe(401);
  });

  test('DELETE /users/me removes user', async ({ request, authUser }) => {
    const res = await request.delete('/users/me', {
      headers: { Authorization: `Bearer ${authUser.token}` },
    });
    expect(res.status()).toBe(204);

    // Token should now be invalid
    const meRes = await request.get('/users/me', {
      headers: { Authorization: `Bearer ${authUser.token}` },
    });
    expect(meRes.status()).toBe(401);
  });
});
