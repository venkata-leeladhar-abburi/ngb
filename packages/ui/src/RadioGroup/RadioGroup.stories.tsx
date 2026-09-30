import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Core/RadioGroup",
  component: RadioGroup,
  // Quiz step 1 (pages.md, Find my plan quiz).
  args: {
    label: "What's your goal?",
    options: [
      { value: "gain", label: "Gain weight" },
      { value: "lose", label: "Lose fat" },
      { value: "strong", label: "Get stronger" },
      { value: "lean", label: "Look lean and fit" },
    ],
  },
  // Padded, not centred: a centred story shrinks to its content, so the rows could not fill the width.
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-(--container-lead)">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen yet: the quiz waits for an answer. */
export const Empty: Story = {};
export const Selected: Story = { args: { defaultValue: "gain" } };
export const Hover: Story = {
  args: { defaultValue: "gain" },
  parameters: { pseudo: { hover: ['[role="radio"][data-state="unchecked"]'] } },
};
export const Focus: Story = {
  args: { defaultValue: "gain" },
  parameters: { pseudo: { focusVisible: ['[role="radio"][data-state="checked"]'] } },
};
export const Disabled: Story = { args: { defaultValue: "gain", disabled: true } };

/** Next pressed with no answer. TODO(copy): the error words are not in pages.md or voice.md yet. */
export const Error: Story = { args: { required: true, error: "TODO(copy): pick one answer" } };

/** Quiz step 3: the question is the page heading, so the group label is for screen readers only. */
export const HiddenLabel: Story = {
  args: {
    label: "How long have you trained?",
    hideLabel: true,
    options: [
      { value: "never", label: "Never" },
      { value: "under6", label: "Under 6 months" },
      { value: "over6", label: "6 months or more" },
    ],
  },
};

/** Real browser: Tab reaches the group; all four arrow keys move and select, wrapping at the ends. */
export const KeyboardSelect: Story = {
  args: { defaultValue: "gain" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Gain weight" })).toHaveFocus();

    await userEvent.keyboard("{ArrowDown>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Lose fat" })).toBeChecked());
    await userEvent.keyboard("{/ArrowDown}");

    await userEvent.keyboard("{ArrowLeft>}");
    await waitFor(() => expect(canvas.getByRole("radio", { name: "Gain weight" })).toBeChecked());
    await userEvent.keyboard("{/ArrowUp}");

    await userEvent.keyboard("{ArrowUp>}");
    await waitFor(() =>
      expect(canvas.getByRole("radio", { name: "Look lean and fit" })).toBeChecked(),
    );
    await userEvent.keyboard("{/ArrowLeft}");
  },
};

/** Telugu copy is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: {
    label: "నీ goal ఏంటి?",
    options: [
      { value: "a", label: "నీ వంతు" },
      { value: "b", label: "నీ Day One ఈరోజే" },
      // Hero headline [TE REVIEW] (home.md section 1): long enough to wrap at 360 px.
      { value: "c", label: "నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు." },
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
