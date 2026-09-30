import { tokens } from "@ngb/tokens";
import type { Preview } from "@storybook/react-vite";

import "./storybook.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
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
