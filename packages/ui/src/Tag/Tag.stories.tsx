import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./Tag";

const meta = {
  title: "Core/Tag",
  component: Tag,
  args: { children: "Most popular" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** home.md section 9: the featured program's tag. */
export const MostPopular: Story = {};

/** Telugu copy for this tag is not written yet (TODO(copy)); an existing Telugu word tests fit only. */
export const TeluguFitTest: Story = {
  args: { children: "నీ వంతు" },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
