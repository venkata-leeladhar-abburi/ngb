import type { Meta, StoryObj } from "@storybook/react-vite";

import { VisuallyHidden } from "./VisuallyHidden";

const meta = {
  title: "Utilities/VisuallyHidden",
  component: VisuallyHidden,
  args: { children: "Only screen readers hear this" },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconButtonLabel: Story = {
  render: () => (
    <button type="button">
      <span aria-hidden="true">▶</span>
      <VisuallyHidden>Play Nawin's story</VisuallyHidden>
    </button>
  ),
};

export const SkipLink: Story = {
  render: () => (
    <VisuallyHidden as="a" href="#main" focusable>
      Skip to content
    </VisuallyHidden>
  ),
};

export const Telugu: Story = {
  args: { children: "నవీన్ కథ ప్లే చేయండి", lang: "te" },
};
