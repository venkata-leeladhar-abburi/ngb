import { tokens } from "@ngb/tokens";
import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";

import "./storybook.css";

const preview: Preview = {
  // Every component gets a Docs page: its description (with "Use for" and "Not for"), props and stories.
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    // Components are drawn for the black site: docs pages use the dark theme (story blocks: storybook.css).
    docs: { theme: themes.dark },
    // "phone" is the 360 px Android target (breakpoint sm). Stories tagged "mobile" select it with
    // `globals: { viewport: { value: "phone" } }`; the Vitest addon then runs them at that size.
    viewport: {
      options: {
        phone: {
          name: "Phone 360",
          // Height has no token and does not matter here: 100vh keeps the addon's default height.
          styles: { width: tokens.layout.breakpoint.sm, height: "100vh" },
          type: "mobile",
        },
      },
    },
    // Any axe violation fails the story test in CI (playbook section 8: component checks).
    a11y: { test: "error" },
  },
};

export default preview;
