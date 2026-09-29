import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionTitle } from "../SectionTitle";
import { StudioBackdrop } from "./StudioBackdrop";

const meta = {
  title: "Brand/StudioBackdrop",
  component: StudioBackdrop,
  parameters: { layout: "fullscreen" },
  args: {
    as: "section",
    className: "px-page py-144",
    children: <SectionTitle speedLines>Pick your plan.</SectionTitle>,
  },
} satisfies Meta<typeof StudioBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 03 "Red studio"; screens A1 and A5. */
export const Red: Story = {};

/** Board 03 "Night": the black ground. */
export const Night: Story = { args: { variant: "night" } };
