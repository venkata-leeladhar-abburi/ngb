import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioBackdrop } from "../StudioBackdrop";
import { PosterWord } from "./PosterWord";

const meta = {
  title: "Brand/PosterWord",
  component: PosterWord,
  args: { children: "Evolve" },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PosterWord>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screen A1: bone EVOLVE behind Nawin on the red studio. The section clips it. */
export const Hero: Story = {
  decorators: [
    (Story) => (
      <StudioBackdrop className="relative min-h-screen overflow-hidden">
        <Story />
      </StudioBackdrop>
    ),
  ],
  args: { className: "absolute inset-x-0 top-0 text-center" },
};

/** Screen A7: the footer watermark at 10%. */
export const Ghost: Story = {
  decorators: [
    (Story) => (
      <div className="relative min-h-screen overflow-hidden bg-page">
        <Story />
      </div>
    ),
  ],
  args: { tone: "ghost", className: "absolute inset-x-0 top-0 text-center" },
  // The ghost word is decoration hidden from screen readers: WCAG 1.4.3 exempts incidental text from
  // contrast. Only the contrast rule is off, only here; every other axe rule still runs.
  parameters: { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } },
};
