import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        reducedMotion: "no-preference",
        launchOptions: { channel: "chrome" },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "webkit",
        reducedMotion: "no-preference",
      },
    },
    {
      name: "android",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        reducedMotion: "no-preference",
        launchOptions: { channel: "chrome" },
      },
    },
    {
      name: "reduced-motion",
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
        launchOptions: { channel: "chrome" },
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
