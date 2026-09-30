import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { Button } from "../Button";
import { Dialog } from "./Dialog";

const meta = {
  title: "Core/Dialog",
  component: Dialog,
  args: {
    trigger: <Button variant="secondary">Share my result</Button>,
    title: "Share my result",
    description: "Save the story card and post it on Instagram.",
    children: <p className="text-muted">Story card preview goes here.</p>,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

/** Real browser: opens, focus moves inside, Escape closes and focus returns. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Share my result" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Share my result" });
    await expect(dialog).toContainElement(document.activeElement as HTMLElement);
  },
};
