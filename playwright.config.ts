import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,

  // Total execution timeout for a single test
  timeout: 120000,

  // Generates report always, but automatically OPENS the browser tab ONLY when a test fails
  reporter: [
    ['html', { open: 'on-failure' }]
  ],

  expect: {
    timeout: 30000,
  },

  use: {
    // Base URL of your Odoo / BOFL system
    baseURL: 'http://192.168.10.26:8127',

    // Running in headed mode so you can see the execution visually
    headless: false,

    // Standard high-definition fullscreen layout
    viewport: { width: 1920, height: 1080 },

    // Captures screenshots and video ONLY when a step or assertion goes wrong
    screenshot: 'only-on-failure', 
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Individual action/navigation timeouts
    actionTimeout: 30000,
    navigationTimeout: 30000,

    // Fallback/Global launch options setup
    launchOptions: {
      args: ['--start-fullscreen'],
      slowMo: 6000, 
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        baseURL: 'http://192.168.10.26:8127',
        viewport: { width: 1920, height: 1080 },

        // Applies a comfortable 0.5-second execution speed specifically for this active project
        launchOptions: {
          args: ['--start-fullscreen'],
          slowMo: 500, 
        },
      },
    },
  ],
});