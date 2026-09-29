import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env["CI"]);
const port = 3100;
const baseURL = process.env["BASE_URL"] ?? `http://localhost:${port}`;

/**
 * Journeys run on the two targets that matter (CLAUDE.md, playbook section 8):
 * a 360 px Android phone (the Instagram in-app browser audience) and 1440 px desktop.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "android",
      use: { ...devices["Galaxy S9+"], viewport: { width: 360, height: 800 } },
    },
  ],
  // Tests run against the production build (pnpm build first; turbo does this for `pnpm e2e`).
  ...(process.env["BASE_URL"]
    ? {}
    : {
        webServer: {
          command: `pnpm --filter @ngb/web exec next start -p ${port}`,
          url: baseURL,
          reuseExistingServer: !isCI,
          timeout: 120_000,
        },
      }),
});
