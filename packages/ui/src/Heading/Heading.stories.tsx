import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading } from "./Heading";

const meta = {
  title: "Core/Heading",
  component: Heading,
  args: { as: "h2", variant: "h1", children: "Free tools" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Board 04 type scale, samples from the board. Levels stay in order; the look comes from `variant`. */
export const AllRoles: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      <Heading as="h1" variant="hero">
        Day one
      </Heading>
      <Heading as="h2" variant="display">
        Start today
      </Heading>
      <Heading as="h2" variant="h1" tone="brand">
        Free tools
      </Heading>
      <Heading as="h3" variant="h2">
        Shred 12
      </Heading>
      <Heading as="h4" variant="h3">
        Calorie calculator
      </Heading>
    </div>
  ),
};

/** Telugu copy is not written yet (TODO(copy)); board 04's Telugu sample tests fit: Anek Telugu, 1.75. */
export const TeluguFitTest: Story = {
  render: () => (
    <div lang="te" className="flex flex-col gap-24">
      <Heading as="h2" variant="display">
        నీ Day One ఈరోజే
      </Heading>
      <Heading as="h3" variant="h1">
        నీ Day One ఈరోజే
      </Heading>
      {/* Hero headline [TE REVIEW] (home.md section 1), narrow so it wraps and shows the line height. */}
      <Heading as="h4" variant="h2" className="max-w-(--spacing-128)">
        నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు.
      </Heading>
      <Heading as="h5" variant="h3" className="max-w-(--spacing-128)">
        నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు.
      </Heading>
    </div>
  ),
};
