import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      // The real package throws outside a React Server Component bundle; tests run in plain Node.
      "server-only": fileURLToPath(new URL("./server/testing/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // Server tests start a throwaway in-process Postgres each; the first one in a file is slow on a
    // busy machine (CI runs every package at once).
    testTimeout: 20_000,
    hookTimeout: 30_000,
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});
