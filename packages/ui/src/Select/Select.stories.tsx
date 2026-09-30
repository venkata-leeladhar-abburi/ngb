import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./Select";

const meta = {
  title: "Core/Select",
  component: Select,
  args: {
    label: "Activity",
    placeholder: "Choose one",
    options: [
      { value: "sitting", label: "Mostly sitting" },
      { value: "light", label: "Light exercise" },
      { value: "train", label: "Train 3–5 days" },
      { value: "very", label: "Very active" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(24rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** pages.md calorie calculator: Activity field. */
export const Empty: Story = {};
export const Chosen: Story = { args: { defaultValue: "train" } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true, focus: true } } };
export const Error: Story = { args: { error: "Please choose your activity." } };
export const Disabled: Story = { args: { disabled: true } };
