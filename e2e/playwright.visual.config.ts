import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env["CI"]);
const port = 6108;

/**
 * Visual snapshots of every Storybook story. Fonts render differently per operating system, so each
 * platform keeps its own references (visual/__screenshots__/<platform>/). Build Storybook first:
 * turbo does this for `pnpm visual`.
 */
export default defineConfig({
  testDir: "./visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: isCI
    ? [["github"], ["html", { open: "never", outputFolder: "visual-report" }]]
    : [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "node visual/serve.mjs",
    url: `http://localhost:${port}/index.json`,
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
});
