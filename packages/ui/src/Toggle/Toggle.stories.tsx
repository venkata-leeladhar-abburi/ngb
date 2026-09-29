import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toggle } from "./Toggle";

const meta = {
  title: "Core/Toggle",
  component: Toggle,
  args: { label: "I eat in a hostel or mess" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lead">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
/** Board 07. The board's round pill is squared off: circles are only for the play button. */
export const On: Story = { args: { defaultChecked: true } };
export const Focus: Story = {
  args: { defaultChecked: true },
  parameters: { pseudo: { focusVisible: true } },
};
export const Disabled: Story = { args: { disabled: true } };

/** Telugu copy for this label is not written yet (TODO(copy)); an existing Telugu line tests fit only. */
export const TeluguFitTest: Story = {
  args: { label: "నేను జీరో నుంచి చేశాను." },
  decorators: [
    (Story) => (
      <div lang="te" className="w-full max-w-lead">
        <Story />
      </div>
    ),
  ],
};
