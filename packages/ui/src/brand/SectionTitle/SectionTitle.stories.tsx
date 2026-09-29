import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Brand/SectionTitle",
  component: SectionTitle,
  args: { children: "What's your goal?" },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screens A2, A3, A4: slash only. */
export const Default: Story = {};

/** Board 08 and screen A5: speed lines before the slash. */
export const WithSpeedLines: Story = { args: { children: "Pick your plan.", speedLines: true } };

/** home.md section 5, Telugu line [TE REVIEW]. Anek Telugu replaces the Compressed face. */
export const Telugu: Story = {
  args: { children: "నీ goal ఏంటి?" },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
