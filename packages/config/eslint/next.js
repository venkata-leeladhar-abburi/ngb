import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

import react from "./react.js";

const serverImport = {
  group: ["@/server", "@/server/*", "**/server/*"],
  message:
    "Server code is imported only by app/ (Server Components, route handlers) and server/ itself.",
};

/** apps/web. Next.js rules plus the one-way layering from CLAUDE.md: tokens -> ui -> sections -> pages. */
export default tseslint.config(
  ...react,
  {
    name: "ngb/next",
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    name: "ngb/layering/pages-use-sections",
    files: ["app/**/*.{ts,tsx}"],
    ignores: ["app/api/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@ngb/ui", "@ngb/ui/*"],
              message: "Pages compose sections only. Import from @/sections, not @ngb/ui.",
            },
          ],
        },
      ],
    },
  },
  {
    name: "ngb/layering/no-server-in-ui",
    files: ["sections/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "content/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": ["error", { patterns: [serverImport] }] },
  },
);
