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

/** Desktop nav and mobile header (board 07, screen A1). */
export const Inline: Story = { args: { variant: "inline" } };

/** Inside the red mobile menu: both bone, current underlined. */
export const InlineOnRed: Story = {
  args: { variant: "inline", tone: "red" },
  decorators: [
    (Story) => (
      <div className="bg-brand p-24">
        <Story />
      </div>
    ),
  ],
};
