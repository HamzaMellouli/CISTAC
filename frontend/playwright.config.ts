import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:4173',
    channel: 'chrome',
    trace: 'off',
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 30000,
  },
})
