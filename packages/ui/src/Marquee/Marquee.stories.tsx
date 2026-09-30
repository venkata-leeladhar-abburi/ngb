import type { Meta, StoryObj } from "@storybook/react-vite";

import { Marquee } from "./Marquee";

const tiles = Array.from({ length: 8 }, (_, index) => (
  <div
    key={index}
    className="flex aspect-3/4 w-128 items-end border border-subtle bg-alt p-12 font-label text-label text-muted uppercase"
  >
    Photo {index + 1}
  </div>
));

const meta = {
  title: "Content/Marquee",
  component: Marquee,
  args: { label: "Community", items: tiles, className: "px-page" },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screen A6 community row. Real photos come from the CMS; these are labelled placeholders. */
export const Community: Story = {};
