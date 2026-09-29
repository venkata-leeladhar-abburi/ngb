import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { OtpInput } from "./OtpInput";

const meta = {
  title: "Core/OtpInput",
  component: OtpInput,
  args: { label: "Enter OTP" },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
/** Board 07: three digits in, the fourth box active. */
export const PartlyFilled: Story = {
  args: { defaultValue: "482" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("textbox"));
  },
};
export const Error: Story = {
  args: { defaultValue: "482915", error: "That code did not match. Try again." },
};
export const Disabled: Story = { args: { defaultValue: "482", disabled: true } };

/** Real browser: pasting a code with a space fills all six boxes. */
export const PasteWithSpace: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox");
    await userEvent.click(input);
    await userEvent.paste("123 456");
    await expect(input).toHaveValue("123456");
  },
};
