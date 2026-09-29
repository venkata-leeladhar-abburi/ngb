import type { Meta, StoryObj } from "@storybook/react-vite";

import { Wordmark } from "./Wordmark";

const meta = {
  title: "Brand/Wordmark",
  component: Wordmark,
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 01: on black. */
export const OnDark: Story = {};
/** Board 01: on studio red. */
export const OnRed: Story = {
  args: { tone: "red" },
  decorators: [
    (Story) => (
      <div className="bg-brand p-24">
        <Story />
      </div>
    ),
  ],
};
/** Board 01: on bone. */
export const OnBone: Story = {
  args: { tone: "bone" },
  decorators: [
    (Story) => (
      <div className="bg-(--text-color-primary) p-24">
        <Story />
      </div>
    ),
  ],
};
export const Large: Story = { args: { size: "lg" } };
