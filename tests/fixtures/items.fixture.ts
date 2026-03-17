import { test as base, APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

export type ItemFixtures = {
  seededItems: {
    token: string;
    items: Array<{ id: string; title: string; category: string; done: boolean }>;
  };
};

export const test = base.extend<ItemFixtures>({
  seededItems: async ({ playwright }, use) => {
    const userReq = await playwright.request.newContext({ baseURL: 'http://localhost:3001' });
    const email = `items-${uuidv4()}@example.com`;
    const password = 'Test1234!';
    const registerRes = await userReq.post('/auth/register', {
      data: { name: 'Items Test User', email, password },
    });
    const { token } = await registerRes.json();

    const itemsReq = await playwright.request.newContext({ baseURL: 'http://localhost:3002' });
    const created: Array<{ id: string; title: string; category: string; done: boolean }> = [];

    const seeds = [
      { title: 'Fixture Item 1', category: 'work', done: false },
      { title: 'Fixture Item 2', category: 'personal', done: true },
      { title: 'Fixture Item 3', category: 'shopping', done: false },
    ];

    for (const seed of seeds) {
      const res = await itemsReq.post('/items', {
        data: seed,
        headers: { Authorization: `Bearer ${token}` },
      });
      created.push(await res.json());
    }

    await use({ token, items: created });

    // Teardown
    for (const item of created) {
      await itemsReq.delete(`/items/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await userReq.delete('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    await userReq.dispose();
    await itemsReq.dispose();
  },
});

export { expect } from '@playwright/test';
