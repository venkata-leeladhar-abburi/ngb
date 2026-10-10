import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioBackdrop } from "../brand/StudioBackdrop";
import { PriceOption } from "./PriceOption";

const meta = {
  title: "Content/PriceOption",
  component: PriceOption,
  // pages.md: Program detail price block. Prices are [CONFIRM].
  args: { priceInr: 1999, period: "once", note: "about ₹24 a day, lifetime access" },
} satisfies Meta<typeof PriceOption>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Program detail hero. */
export const Once: Story = {};

/** pages.md: NGB Evolve Club. */
export const Monthly: Story = { args: { priceInr: 499, period: "a month", note: undefined } };
export const Yearly: Story = { args: { priceInr: 3999, period: "a year", note: "save 33%" } };

/** Indian grouping: ₹1,00,000. */
export const LargeAmount: Story = { args: { priceInr: 100000, period: "a year", note: undefined } };

/** On the red studio: bone text only. */
export const OnRed: Story = {
  decorators: [
    (Story) => (
      <StudioBackdrop className="p-48">
        <Story />
      </StudioBackdrop>
    ),
  ],
};

/** Telugu copy is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: { period: "వారాలు", note: undefined },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
