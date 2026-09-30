import { CalculatorIcon } from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResultCard } from "./ResultCard";

const meta = {
  title: "Content/ResultCard",
  component: ResultCard,
  args: {
    icon: CalculatorIcon,
    title: "Calorie calculator",
    valueLabel: "Your daily target",
    value: "2,480 kcal",
    details: "Protein: 115 g a day.",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(22rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** pages.md calorie calculator result (screen B4). */
export const Result: Story = {};

/** Board 08 tool card: healthy status with icon and word, and the recommendation link. */
export const WithRecommendation: Story = {
  args: {
    status: "Healthy deficit",
    action: { href: "#shred-12", label: "Get the Shred 12 plan" },
  },
};
