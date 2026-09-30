import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { Button } from "../Button";
import { ToastProvider, useToast } from "./Toast";

function Demo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-16">
      <Button
        variant="secondary"
        onClick={() => {
          toast("Link copied.", { tone: "good" });
        }}
      >
        Copy link
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          toast("Done. Check WhatsApp in a minute.", { tone: "good" });
        }}
      >
        Send my plan
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          toast("Enter a 10-digit mobile number.", { tone: "error" });
        }}
      >
        Show error
      </Button>
    </div>
  );
}

const meta = {
  title: "Core/Toast",
  component: ToastProvider,
  args: { children: <Demo /> },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** voice.md microcopy library. */
export const Messages: Story = {};

/** Real browser: a toast appears in the notifications region. */
export const LeadSaved: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Send my plan" }));
    await expect(await screen.findByText("Done. Check WhatsApp in a minute.")).toBeVisible();
  },
};
