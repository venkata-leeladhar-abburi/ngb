import type { Meta, StoryObj } from "@storybook/react-vite";

import { ShareCard } from "./ShareCard";

const meta = {
  title: "Content/ShareCard",
  component: ShareCard,
  args: { headline: "My daily target", value: "2,480 kcal" },
  decorators: [
    (Story) => (
      <div style={{ width: "min(16rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShareCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 08 and handoff section 5: "My daily target: 2,480 kcal · Built with NGB Evolve". */
export const CalorieResult: Story = {};
