// import { defineConfig } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',

//   fullyParallel: true,
//   forbidOnly: !!process.env.CI,
//   retries: 1,
//   workers: 1,

//   timeout: 60000,

//   reporter: 'html',

//   expect: {
//     timeout: 30000,
//   },

//   use: {
//     // Base URL
//     baseURL: 'http://192.168.10.26:8127',

//     // Browser settings
//     headless: false,

//     // Stable fullscreen (recommended over maximize)
//     viewport: { width: 1920, height: 1080 },

//     // Debugging helpers
//     video: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     trace: 'on-first-retry',

//     // Timeouts
//     actionTimeout: 30000,
//     navigationTimeout: 30000,

//     // Slow execution (for learning/debugging)
//     launchOptions: {
//       args: ['--start-fullscreen'],
//       slowMo: 6000, // 👈 every action delay (0.5 sec)
//     },
//   },

//   // Browser project
//   projects: [
//     {
//       name: 'chromium',
//       use: {
//         baseURL: 'http://192.168.10.26:8127',
//         viewport: { width: 1920, height: 1080 },

//         launchOptions: {
//           args: ['--start-fullscreen'],
//           slowMo: 500,
//         },
//       },
//     },
//   ],
// });


import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,

  timeout: 60000,

  //Change made here: The HTML report will only open automatically on failure
  reporter: [
    ['html', { open: 'on-failure' }]
  ],

  expect: {
    timeout: 30000,
  },

  use: {
    // Base URL
    baseURL: 'http://192.168.10.26:8127',

    // Browser settings
    headless: false,

    // Stable fullscreen (recommended over maximize)
    viewport: { width: 1920, height: 1080 },

    // Debugging helpers
    video: 'on-first-retry',
    screenshot: 'only-on-failure', //Captures and attaches screenshots to the report on failure
    trace: 'on-first-retry',

    // Timeouts
    actionTimeout: 30000,
    navigationTimeout: 30000,

    // Slow execution (for learning/debugging)
    launchOptions: {
      args: ['--start-fullscreen'],
      slowMo: 6000, //Global action delay (6 seconds)
    },
  },

  // Browser project
  projects: [
    {
      name: 'chromium',
      use: {
        baseURL: 'http://192.168.10.26:8127',
        viewport: { width: 1920, height: 1080 },

        launchOptions: {
          args: ['--start-fullscreen'],
          slowMo: 500, //Project specific delay override (0.5 seconds)
        },
      },
    },
  ],
});