import type { Meta, StoryObj } from "@storybook/react-vite";

import { Footer } from "./Footer";
import { footerFixture } from "./footer-fixture";

const meta = {
  title: "Navigation/Footer",
  component: Footer,
  args: { ...footerFixture, className: "px-page" },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screen A7 and home.md section 13. The legal line is [CONFIRM]. */
export const Default: Story = {};
