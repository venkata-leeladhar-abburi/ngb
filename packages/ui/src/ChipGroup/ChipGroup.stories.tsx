import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ChipGroup } from "./ChipGroup";

const meta = {
  title: "Core/ChipGroup",
  component: ChipGroup,
  args: {
    label: "Training focus",
    defaultValue: "chest",
    options: [
      { value: "chest", label: "Chest" },
      { value: "back", label: "Back" },
      { value: "legs", label: "Legs" },
      { value: "home", label: "Home" },
    ],
  },
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 07 "Training focus". */
export const Default: Story = {};
export const Hover: Story = {
  parameters: { pseudo: { hover: ['[role="radio"][data-state="unchecked"]'] } },
};
export const Focus: Story = {
  parameters: { pseudo: { focusVisible: ['[role="radio"][data-state="checked"]'] } },
};

/** Screen A4 results filter: label read by screen readers only. */
export const FilterWithHiddenLabel: Story = {
  args: {
    label: "Filter results",
    hideLabel: true,
    defaultValue: "all",
    options: [
      { value: "all", label: "All" },
      { value: "gained", label: "Gained weight" },
      { value: "lost", label: "Lost fat" },
      { value: "women", label: "Women" },
      { value: "home", label: "Home only" },
    ],
  },
};

/** Real browser: arrow keys move and select, wrapping at the ends. */
export const KeyboardSelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Chest" })).toHaveFocus();
    // Held like a person's key press: Radix selects when focus arrives while the key is still down.
    await userEvent.keyboard("{ArrowLeft>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Home" })).toBeChecked());
    await userEvent.keyboard("{/ArrowLeft}");
  },
};
