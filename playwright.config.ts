import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false, 
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,

  timeout: 120000,

  reporter: [
    ['html', { open: 'on-failure' }]
  ],

  expect: {
    timeout: 30000,
  },

  use: {
    headless: false,
    viewport: { width: 1920, height: 1080 },

    screenshot: 'only-on-failure', 
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'port8127',
      use: {
        baseURL: 'http://192.168.10.26:8127',
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--start-fullscreen'],
          slowMo: 500, 
        },
      },
    },
    { 
      name: 'port8128',
      use: {
        baseURL: 'http://192.168.10.26:8128',
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--start-fullscreen'],
          slowMo: 500, 
        },
      },
    },
  ],
}); 
