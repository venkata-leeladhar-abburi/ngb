import type { Preview } from "@storybook/react-vite";

import "./storybook.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    // Any axe violation fails the story test in CI (playbook section 8: component checks).
    a11y: { test: "error" },
  },
};

export default preview;
