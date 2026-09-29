import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeanFrame } from "./LeanFrame";

const meta = {
  title: "Brand/LeanFrame",
  component: LeanFrame,
  args: { className: "h-128 w-96", children: null },
} satisfies Meta<typeof LeanFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A labelled placeholder: real photos only (board 06), never stock or AI-made people. */
export const PhotoPlaceholder: Story = {
  args: {
    className: "aspect-3/4 w-128 border border-strong",
    children: (
      <div className="flex size-full items-center justify-center bg-alt p-16 text-center text-muted">
        Photo placeholder
      </div>
    ),
  },
};

/** The content stays upright while the frame leans. */
export const UprightContent: Story = {
  args: {
    className: "h-96 w-128 bg-card",
    children: (
      <p className="flex size-full items-end p-16 font-label text-label font-bold uppercase">
        12 weeks / +X kg
      </p>
    ),
  },
};
