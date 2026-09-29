import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    // Renders hover, pressed and focus states statically so every state has a story (ui.md).
    "storybook-addon-pseudo-states",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  // The same subsetted fonts the site ships (see apps/web/scripts/fonts.ts).
  staticDirs: [{ from: "../../../apps/web/fonts/web", to: "/fonts" }],
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    return viteConfig;
  },
};

export default config;
