import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { SegmentedControl } from "./SegmentedControl";

const meta = {
  title: "Core/SegmentedControl",
  component: SegmentedControl,
  args: {
    label: "Your goal",
    defaultValue: "lose",
    options: [
      { value: "lose", label: "Lose fat" },
      { value: "same", label: "Stay the same" },
      { value: "gain", label: "Gain weight" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 07 "Your goal". */
export const Default: Story = {};
export const LastSelected: Story = { args: { defaultValue: "gain" } };
export const Hover: Story = {
  parameters: { pseudo: { hover: ['[role="radio"][data-state="unchecked"]'] } },
};
export const Disabled: Story = { args: { disabled: true } };

/**
 * Real browser: Tab reaches the chosen segment; arrow keys move and select, wrapping at the ends.
 * Radix selects when focus arrives while the arrow key is still down, so each press is held like a
 * person's (a simulated instant press-and-release would release before focus moves).
 */
export const KeyboardSelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Lose fat" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Stay the same" })).toBeChecked());
    await userEvent.keyboard("{/ArrowRight}");

    await userEvent.keyboard("{ArrowLeft>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Lose fat" })).toBeChecked());
    await userEvent.keyboard("{/ArrowLeft}");

    await userEvent.keyboard("{ArrowLeft>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Gain weight" })).toBeChecked());
    await userEvent.keyboard("{/ArrowLeft}");
  },
};

/** Telugu copy for these options is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: {
    label: "నీ goal ఏంటి?",
    options: [
      { value: "a", label: "నీ వంతు" },
      { value: "b", label: "ఈరోజే" },
    ],
    defaultValue: "a",
  },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
