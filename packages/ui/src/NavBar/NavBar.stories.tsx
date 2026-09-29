import type { Meta, StoryObj } from "@storybook/react-vite";

import { navFixture } from "./nav-fixture";
import { NavBar } from "./NavBar";

const meta = {
  title: "Navigation/NavBar",
  component: NavBar,
  args: navFixture,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-page px-page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screen A1: no link active on the homepage. */
export const Home: Story = {};

/** Screen B1: Programs is the current page. */
export const OnProgramsPage: Story = {
  args: {
    links: navFixture.links.map((link) => ({ ...link, current: link.href === "#programs" })),
  },
};
