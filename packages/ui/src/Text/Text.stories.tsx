import type { Meta, StoryObj } from "@storybook/react-vite";

import { CheckCircleIcon, WarningIcon } from "@phosphor-icons/react/ssr";

import { Icon } from "../Icon";
import { Text } from "./Text";

const meta = {
  title: "Core/Text",
  component: Text,
  args: {
    children: "Pick your goal, enter your stats, and get your daily calories in 30 seconds.",
  },
  decorators: [
    (Story) => (
      <div className="max-w-measure">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

/** Board 04 roles, samples from the board. */
export const AllRoles: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <Text variant="label">Start my plan</Text>
      <Text variant="lead">Train the way I trained.</Text>
      <Text>Real food. Real plan.</Text>
      <Text variant="data" tone="muted">
        ₹24 a day
      </Text>
      <Text variant="readout">2,480 kcal</Text>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Text>Used only for your result.</Text>
      <Text tone="muted">Used only for your result.</Text>
      <Text tone="accent" className="flex items-start gap-8">
        <Icon icon={WarningIcon} />
        Enter a weight between 30 and 200 kg.
      </Text>
      {/* Good green never carries meaning alone: an icon and a word go with it (CLAUDE.md colour roles). */}
      <Text tone="good" className="flex items-center gap-8">
        <Icon icon={CheckCircleIcon} />
        Healthy range
      </Text>
    </div>
  ),
};

/** Telugu copy is not written yet (TODO(copy)); board 04's Telugu sample tests fit: Noto Sans Telugu, 1.75. */
export const TeluguFitTest: Story = {
  render: () => (
    <div lang="te" className="flex flex-col gap-16">
      <Text variant="label">నీ Day One ఈరోజే</Text>
      {/* Hero headline [TE REVIEW] (home.md section 1), narrow so the lead wraps. */}
      <Text variant="lead" className="max-w-(--spacing-128)">
        నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు.
      </Text>
      <Text>నీ Day One ఈరోజే</Text>
    </div>
  ),
};
