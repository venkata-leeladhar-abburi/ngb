import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";

import { navFixture } from "../NavBar/nav-fixture";
import { MobileHeader } from "./MobileHeader";

const meta = {
  title: "Navigation/MobileHeader",
  component: MobileHeader,
  args: navFixture,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-page px-page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 07 mobile header, 56 px. */
export const Closed: Story = {};

/** Handoff section 6: full screen on red, links in Rush Driver. Real browser: opens and traps focus. */
export const MenuOpen: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open menu" }));
    const menu = await screen.findByRole("dialog", { name: "Menu" });
    await expect(within(menu).getByRole("link", { name: "Transformations" })).toBeVisible();
    await expect(menu).toContainElement(document.activeElement as HTMLElement);
  },
};
