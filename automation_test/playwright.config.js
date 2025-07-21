// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    
    /**
     * Set the baseURL so you can just write in tests:
     * await page.goto('/auth/signin')
     */
    baseURL: 'http://localhost:4200',

    trace: 'on-first-retry',
    headless: false,  
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // you can also enable the other browsers if needed
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  /**
   * (Optional) Automatically start your Angular dev server
   * if you have a `start` script in your package.json
   */
  // webServer: {
  //   command: 'cd ../frontend && npm run start', // adjust if you use a different command
  //   url: 'http://localhost:4200',
  //   reuseExistingServer: !process.env.CI,
  // },
})
