import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatStrip } from "./StatStrip";

const meta = {
  title: "Content/StatStrip",
  component: StatStrip,
  parameters: { layout: "fullscreen" },
  args: {
    className: "px-page",
    stats: [
      { value: 1_000_000, compact: true, suffix: "+", label: "follow the journey on Instagram" },
      { value: 2022, countUp: false, label: "the year day one started" },
      { placeholder: "[REAL DATA]", label: "members coached" },
      { value: 100, suffix: "%", label: "of plans in Telugu and English" },
    ],
  },
} satisfies Meta<typeof StatStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** home.md section 2. "1M+" is [CONFIRM]; members coached is [REAL DATA] and stays a visible placeholder. */
export const ProofStrip: Story = {};

/** Screen A1 variant: three short stats. */
export const ThreeStats: Story = {
  args: {
    stats: [
      { value: 1_000_000, compact: true, suffix: "+", label: "Instagram" },
      { value: 2022, countUp: false, label: "Day one" },
      { value: 100, suffix: "%", label: "Telugu + English" },
    ],
  },
};
