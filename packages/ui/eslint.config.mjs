import react from "@ngb/config/eslint/react";

export default [
  ...react,
  { ignores: ["!.storybook"] },
  {
    name: "ngb/ui/no-app-imports",
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@ngb/web", "@ngb/web/*", "**/apps/**"],
              message:
                "packages/ui must not depend on apps. Layering is tokens -> ui -> sections -> pages.",
            },
          ],
        },
      ],
    },
  },
];
