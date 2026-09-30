import type { Meta, StoryObj } from "@storybook/react-vite";

import { StickyActionBar, StickyBuyBar } from "./StickyBar";

const meta = {
  title: "Navigation/StickyBar",
  component: StickyBuyBar,
  // Phone-only component (hidden from lg): story tests and visual snapshots use the 360 px phone viewport.
  tags: ["mobile"],
  globals: { viewport: { value: "phone", isRotated: false } },
  parameters: { layout: "fullscreen" },
  args: {
    visible: true,
    name: "Mass Builder",
    priceInr: 1999,
    weeks: 12,
    cta: { href: "#buy", label: "Start my plan" },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StickyBuyBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** pages.md, program detail (screen B3). Shown on phones only. */
export const BuyBar: Story = {};

/** Before the hero scrolls away: off screen and inert. */
export const BuyBarHidden: Story = { args: { visible: false } };

/** Handoff section 6: the homepage bar after the hero. */
export const HomeActions: Story = {
  render: () => (
    <StickyActionBar
      visible
      primary={{ href: "#start", label: "Start my plan" }}
      secondary={{ href: "#tools", label: "Try free tools" }}
    />
  ),
};
