import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProgressSteps } from "./ProgressSteps";

const meta = {
  title: "Navigation/ProgressSteps",
  component: ProgressSteps,
  args: { label: "Checkout steps", steps: ["Your phone number", "Pay"], current: 0 },
  decorators: [
    (Story) => (
      <div style={{ width: "min(32rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** pages.md checkout (screen B6). */
export const CheckoutPhone: Story = {};
export const CheckoutPay: Story = { args: { current: 1 } };

/** pages.md quiz: four questions. */
export const Quiz: Story = {
  args: { label: "Quiz progress", steps: ["Goal", "Where", "Experience", "Food"], current: 2 },
};
