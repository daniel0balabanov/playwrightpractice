import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  reporter: [
    ['html'],
    ['allure-playwright'],
  ],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testDir: './api',
      use: {
        baseURL: 'http://localhost:3001',
      },
    },
    {
      name: 'ui',
      testDir: './ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'integration',
      testDir: './integration',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },
  ],
});
