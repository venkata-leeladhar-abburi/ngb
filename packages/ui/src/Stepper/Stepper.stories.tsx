import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Stepper } from "./Stepper";

const meta = {
  title: "Core/Stepper",
  component: Stepper,
  // pages.md: Telugu Plate. Labels follow screens.md B5 ("Add one pappu").
  args: {
    value: 2,
    min: 0,
    max: 20,
    decreaseLabel: "Remove one boiled egg",
    increaseLabel: "Add one boiled egg",
    valueLabel: "2 portions",
    onChange: () => undefined,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** At the minimum the minus button is muted and aria-disabled, but still focusable. */
export const AtMinimum: Story = { args: { value: 0, valueLabel: "0 portions" } };

/** At the maximum the plus button is muted. */
export const AtMaximum: Story = { args: { value: 20, valueLabel: "20 portions" } };

export const Hover: Story = { parameters: { pseudo: { hover: ["button"] } } };
export const Pressed: Story = { parameters: { pseudo: { active: ["button"] } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: ["button:last-of-type"] } } };

/** Working example: the count changes and stops at 0 and 3. */
export const Interactive: Story = {
  render: function Counter(args) {
    const [value, setValue] = useState(1);
    return (
      <Stepper
        {...args}
        value={value}
        max={3}
        onChange={setValue}
        valueLabel={`${value} portions`}
      />
    );
  },
};
