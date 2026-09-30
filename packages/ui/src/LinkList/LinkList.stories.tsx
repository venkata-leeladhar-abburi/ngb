import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinkList } from "./LinkList";

const groups = ["Chest", "Back", "Legs", "Arms", "Shoulders", "Abs", "Home"];

const meta = {
  title: "Content/LinkList",
  component: LinkList,
  // home.md §7 muscle groups.
  args: {
    label: "Muscle groups",
    items: groups.map((group) => ({
      href: `#${group.toLowerCase()}`,
      label: group,
      meta: "3 free",
    })),
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-(--container-lead)">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MuscleGroups: Story = {};
/** Screen A4: the featured video's group (Chest) is the current row. */
export const CurrentRow: Story = { args: { current: "#chest" } };
export const RowHover: Story = { parameters: { pseudo: { hover: ["li:first-child a"] } } };
export const RowFocus: Story = { parameters: { pseudo: { focusVisible: ["li:first-child a"] } } };

/** Telugu copy is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: { items: [{ href: "#a", label: "నీ Day One ఈరోజే", meta: "నీ వంతు" }] },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
