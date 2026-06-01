import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for landing-vehiculos.
 * Two projects:
 *  - mock-mode: runs with LANDING_PROVIDER=mock (default)
 *  - mock-mutated: reserved for mutated-fixture tests (Phase 5, T-052/T-053)
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mock-mode",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mock-mutated",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
