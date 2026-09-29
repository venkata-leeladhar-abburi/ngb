import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

import base, { tokenGuard } from "./base.js";

/** React packages (packages/ui). Adds hooks, strict jsx-a11y, Storybook rules and the token guard. */
export default tseslint.config(
  ...base,
  {
    name: "ngb/react",
    files: ["**/*.{ts,tsx}"],
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } },
  },
  reactHooks.configs.flat["recommended-latest"],
  jsxA11y.flatConfigs.strict,
  { ...tokenGuard, files: ["**/*.{ts,tsx}"] },
  ...storybook.configs["flat/recommended"],
);
