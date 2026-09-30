import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          // Keyboard tests with many user-event steps can pass 5 s when both projects run at once.
          testTimeout: 15_000,
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        // Every story renders in a real browser with axe (a11y: "error" in preview.ts). The addon sizes the
        // page from each story's viewport global: 1200 px by default, 360 px for stories tagged "mobile".
        plugins: [storybookTest({ configDir: `${dirname}.storybook` })],
        test: {
          name: "storybook",
          // Axe on the largest pages (Foundations) can pass 15 s when the whole suite runs in parallel.
          testTimeout: 30_000,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
