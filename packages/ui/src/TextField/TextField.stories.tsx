import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextField } from "./TextField";

const meta = {
  title: "Core/TextField",
  component: TextField,
  args: {
    label: "Weight (kg)",
    hint: "Used only for your result.",
    inputMode: "decimal",
    defaultValue: "72",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lead">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 07, left field. */
export const Default: Story = {};
export const Empty: Story = { args: { defaultValue: "" } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true, focus: true } } };
/** Board 07, middle field: error with icon and words. */
export const Error: Story = {
  args: { defaultValue: "7", error: "Enter a weight between 30 and 200 kg." },
};
export const Disabled: Story = { args: { disabled: true } };

/** Telugu labels are not written yet (TODO(copy)); an existing Telugu line tests fit only. */
export const TeluguFitTest: Story = {
  args: {
    label: "నీ goal ఏంటి?",
    hint: "నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు.",
    defaultValue: "",
  },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
