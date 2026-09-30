import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Core/Checkbox",
  component: Checkbox,
  args: {
    label:
      "I agree to get my plan and fitness tips from NGB Evolve on WhatsApp. I can stop anytime.",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(32rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** voice.md WhatsApp consent: always starts unticked. */
export const Unticked: Story = {};
export const Ticked: Story = { args: { defaultChecked: true } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['[role="checkbox"]'] } } };
export const Error: Story = { args: { error: "Tick this to get your plan on WhatsApp." } };
export const Disabled: Story = { args: { disabled: true } };

/** Telugu consent copy is not written yet (TODO(copy)); an existing Telugu line tests fit only. */
export const TeluguFitTest: Story = {
  args: { label: "నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు." },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
