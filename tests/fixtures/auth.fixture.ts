import { test as base, APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

export type AuthFixtures = {
  authUser: {
    token: string;
    user: { id: string; name: string; email: string };
    password: string;
  };
};

export const test = base.extend<AuthFixtures>({
  authUser: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({ baseURL: 'http://localhost:3001' });
    const email = `test-${uuidv4()}@example.com`;
    const password = 'Test1234!';
    const name = 'Test User';

    const res = await request.post('/auth/register', {
      data: { name, email, password },
    });
    const { token, user } = await res.json();

    await use({ token, user, password });

    // Teardown: delete user
    await request.delete('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    await request.dispose();
  },
});

export { expect } from '@playwright/test';
