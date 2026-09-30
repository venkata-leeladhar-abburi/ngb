import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Reveal } from "./Reveal";

const meta = {
  title: "Core/Reveal",
  component: Reveal,
  args: { effect: "rise", children: null },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Already on screen at load, so it simply shows (the entrance plays only when scrolled into view). */
export const Rise: Story = {
  args: {
    children: (
      <div className="border border-subtle bg-card p-24 text-primary">Featured program card</div>
    ),
  },
};

export const Breathe: Story = {
  args: {
    effect: "breathe",
    children: <Button>Start my plan</Button>,
  },
};
