import { CrownIcon, UserIcon } from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioBackdrop } from "../brand/StudioBackdrop";
import { LinkCard } from "./LinkCard";

const meta = {
  title: "Content/LinkCard",
  component: LinkCard,
  // home.md §9, under the cards.
  args: {
    href: "#coaching",
    icon: UserIcon,
    title: "Want a coach checking on you every week?",
    label: "1:1 Coaching",
  },
  decorators: [
    (Story) => (
      <StudioBackdrop className="p-24 md:p-48">
        <div className="max-w-(--container-lead)">
          <Story />
        </div>
      </StudioBackdrop>
    ),
  ],
} satisfies Meta<typeof LinkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Coaching: Story = {};
export const Club: Story = {
  args: {
    href: "#club",
    icon: CrownIcon,
    title: "Want every plan, every month?",
    label: "Join the Club",
  },
};
export const Hover: Story = { parameters: { pseudo: { hover: ["a"] } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: ["a"] } } };
