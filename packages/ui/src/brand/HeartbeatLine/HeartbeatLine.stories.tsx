import type { Meta, StoryObj } from "@storybook/react-vite";

import { HeartbeatLine } from "./HeartbeatLine";

const meta = {
  title: "Brand/HeartbeatLine",
  component: HeartbeatLine,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-32">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeartbeatLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 06: bone at 30% on dark grounds. */
export const Bone: Story = {};

/** Board 08: signal red on the oxblood stat strip. */
export const OnStatStrip: Story = {
  args: { tone: "red" },
  decorators: [
    (Story) => (
      <div className="bg-band py-16">
        <Story />
      </div>
    ),
  ],
};
