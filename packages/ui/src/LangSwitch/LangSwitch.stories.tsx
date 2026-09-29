import type { Meta, StoryObj } from "@storybook/react-vite";

import { LangSwitch } from "./LangSwitch";

const meta = {
  title: "Core/LangSwitch",
  component: LangSwitch,
  args: { current: "en", enHref: "#en", teHref: "#te" },
} satisfies Meta<typeof LangSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 07 "Language". */
export const English: Story = {};
export const Telugu: Story = { args: { current: "te" } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: ['a[lang="te"]'] } } };
