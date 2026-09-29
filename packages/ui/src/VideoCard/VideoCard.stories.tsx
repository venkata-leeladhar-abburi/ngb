import type { Meta, StoryObj } from "@storybook/react-vite";

import { VideoCard } from "./VideoCard";

const meta = {
  title: "Content/VideoCard",
  component: VideoCard,
  args: { href: "#chest-at-home", title: "Chest at home", meta: "12 min, Telugu" },
  decorators: [
    (Story) => (
      <div style={{ width: "18rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** home.md section 7: free video. Thumbnails arrive with the real footage. */
export const Free: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } } };

/** home.md section 7: the 4th video per group is locked and links to the program. */
export const Locked: Story = {
  args: {
    href: "#mass-builder",
    title: "Full chest plan",
    meta: undefined,
    locked: true,
    lockedLabel: "Inside Mass Builder",
  },
};
