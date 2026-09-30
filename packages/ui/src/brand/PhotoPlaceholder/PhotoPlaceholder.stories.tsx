import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeanFrame } from "../LeanFrame";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

const meta = {
  title: "Brand/PhotoPlaceholder",
  component: PhotoPlaceholder,
  args: {
    label: "Photo: Nawin on the red studio, hero pose (shoot pending)",
    className: "aspect-4/5 w-(--spacing-144) md:w-(--container-lead)",
  },
} satisfies Meta<typeof PhotoPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Read out like the future photo's alt text. */
export const Default: Story = {};

/** In a leaning frame, as the journey and goal photos will be. */
export const InLeanFrame: Story = {
  render: (args) => (
    <LeanFrame className="aspect-3/4 w-(--spacing-144)">
      <PhotoPlaceholder {...args} className="size-full" />
    </LeanFrame>
  ),
  args: { label: "Photo: Nawin, archive photo (to collect)" },
};
