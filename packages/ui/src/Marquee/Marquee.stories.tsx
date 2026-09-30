import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeanFrame } from "../brand/LeanFrame";
import { Marquee } from "./Marquee";

/** Screen A6 draws the community row as leaning strips; labelled placeholders until real photos exist. */
const tiles = Array.from({ length: 8 }, (_, index) => (
  <LeanFrame key={index} className="h-(--spacing-144) w-96 border border-subtle bg-alt">
    <span className="flex size-full items-end p-12 font-label text-label text-muted uppercase">
      Photo {index + 1}
    </span>
  </LeanFrame>
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
