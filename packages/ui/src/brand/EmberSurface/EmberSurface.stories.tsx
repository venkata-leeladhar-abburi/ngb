import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmberSurface } from "./EmberSurface";

const meta = {
  title: "Brand/EmberSurface",
  component: EmberSurface,
} satisfies Meta<typeof EmberSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Content sits on the dark lower zone. Names are placeholders until consented results exist. */
export const Card: Story = {
  parameters: { layout: "padded" },
  args: {
    className: "aspect-3/4 w-1/3 p-24",
    children: (
      <>
        <p className="font-label text-label font-bold uppercase">Name, Town</p>
        <p className="font-data">12 weeks / +X kg</p>
      </>
    ),
  },
};

/** Final call (screen A7): red light rising from the bottom. */
export const Glow: Story = {
  parameters: { layout: "fullscreen" },
  args: {
    variant: "glow",
    className: "flex min-h-screen items-end justify-center pb-96",
    children: <p className="font-display text-display uppercase italic">Your day one</p>,
  },
};
