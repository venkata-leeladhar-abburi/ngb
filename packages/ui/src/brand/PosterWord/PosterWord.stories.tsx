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

/** Screen A1: the ghost-gradient EVOLVE behind Nawin on the red studio. The section clips it. */
export const Hero: Story = {
  // Decorative and hidden from screen readers (WCAG 1.4.3 exempts incidental text); other rules still run.
  parameters: { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } },
  decorators: [
    (Story) => (
      <StudioBackdrop className="relative flex min-h-screen justify-center overflow-hidden pt-24">
        <Story />
      </StudioBackdrop>
    ),
  ],
};

/** Screen A7: the footer watermark at 10%. */
export const Watermark: Story = {
  decorators: [
    (Story) => (
      <div className="relative flex min-h-screen justify-center overflow-hidden bg-page pt-24">
        <Story />
      </div>
    ),
  ],
  args: { tone: "watermark" },
  // The watermark is decoration hidden from screen readers: WCAG 1.4.3 exempts incidental text from
  // contrast. Only the contrast rule is off, only here; every other axe rule still runs.
  parameters: { a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } } },
};
