import type { Meta, StoryObj } from "@storybook/react-vite";

import { GoalTile } from "./GoalTile";

const meta = {
  title: "Content/GoalTile",
  component: GoalTile,
  // home.md §5, the first tile.
  args: {
    href: "#mass-builder",
    title: "Gain weight",
    line: "Skinny? Build real size, even on hostel food.",
    placeholderLabel: "Photo: Nawin lifting (shoot pending)",
  },
  // Padded, not centred: a centred story shrinks to its content, and the tile sizes from its width.
  parameters: { layout: "padded" },
} satisfies Meta<typeof GoalTile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One tile at its desktop width (a quarter of the content width). */
const tileWidth: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div className="w-1/2 lg:w-1/4">
      <Story />
    </div>
  ),
];

export const Default: Story = { decorators: tileWidth };
export const Hover: Story = { decorators: tileWidth, parameters: { pseudo: { hover: ["a"] } } };
export const Focus: Story = {
  decorators: tileWidth,
  parameters: { pseudo: { focusVisible: ["a"] } },
};

/** home.md §5: 2 x 2 on phones, 4 across on desktop. */
export const FourGoals: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-(--container-content) px-page py-48">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ul className="grid grid-cols-2 gap-16 lg:grid-cols-4 lg:gap-24">
      {[
        ["Gain weight", "Skinny? Build real size, even on hostel food."],
        ["Lose fat", "Lose the belly without giving up rice."],
        ["Train at home", "No gym nearby? Your body is the gym."],
        ["Start from zero", "Never trained? Start here, step by step."],
      ].map(([title, line]) => (
        <li key={title}>
          <GoalTile {...args} title={title} line={line} />
        </li>
      ))}
    </ul>
  ),
};

/** Telugu copy is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: { title: "నీ Day One ఈరోజే", line: "నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు." },
  decorators: [
    (Story) => (
      <div lang="te" className="w-1/2 lg:w-1/4">
        <Story />
      </div>
    ),
  ],
};
