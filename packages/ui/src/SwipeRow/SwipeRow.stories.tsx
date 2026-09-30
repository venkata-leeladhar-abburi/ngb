import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { TransformationCard } from "../TransformationCard";
import { SwipeRow } from "./SwipeRow";

const card = (key: number) => (
  <TransformationCard key={key} name="[Name]" town="[City]" weeks={12} change="[+/− kg]" />
);

const meta = {
  title: "Content/SwipeRow",
  component: SwipeRow,
  args: {
    label: "Member results",
    previousLabel: "Previous results",
    nextLabel: "Next results",
    items: [1, 2, 3, 4, 5, 6].map(card),
    itemClassName: "w-4/5 md:w-2/5 lg:w-1/4",
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof SwipeRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screen A4: at the start, "Previous" is disabled. */
export const AtStart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Previous results" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(canvas.getByRole("button", { name: "Next results" })).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  },
};

/** Fewer items than fit: both buttons disabled. */
export const AllVisible: Story = {
  args: { items: [1, 2].map(card) },
};

/** Items with nothing focusable inside: the row itself takes focus so it can be scrolled by keyboard. */
export const PlainItems: Story = {
  args: {
    items: [1, 2, 3, 4, 5, 6].map((n) => (
      <p key={n} className="border border-subtle bg-card p-24 text-primary">
        Result {n}
      </p>
    )),
  },
};
