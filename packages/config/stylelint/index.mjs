/**
 * CSS outside packages/tokens may not contain raw design values (playbook section 8).
 * Use CSS variables from packages/tokens instead.
 */
const tokenMessage = "Use a token from packages/tokens instead of a raw value.";

/** @type {import("stylelint").Config} */
const config = {
  ignoreFiles: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/storybook-static/**",
    "packages/tokens/**",
  ],
  rules: {
    "color-no-hex": [true, { message: tokenMessage }],
    "color-named": ["never", { message: tokenMessage }],
    "function-disallowed-list": [
      ["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch"],
      { message: tokenMessage },
    ],
    "unit-disallowed-list": [["px"], { message: tokenMessage }],
    "declaration-property-value-disallowed-list": [
      { "z-index": ["/^\\d+$/"], "box-shadow": ["/\\d/"] },
      { message: tokenMessage },
    ],
  },
};

export default config;
