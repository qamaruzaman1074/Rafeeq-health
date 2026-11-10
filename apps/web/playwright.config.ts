import { defineConfig, devices } from "@playwright/test";

const port = 5173;
const baseURL = `http://127.0.0.1:${port}`;
const chromiumDevice = devices["Desktop Chrome"];

if (chromiumDevice === undefined) {
  throw new Error("Playwright device descriptor Desktop Chrome is missing");
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `VITE_USE_MOCKS=true npm run dev -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...chromiumDevice },
    },
  ],
});
