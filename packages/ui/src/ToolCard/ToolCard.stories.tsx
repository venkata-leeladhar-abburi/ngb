import {
  BarbellIcon,
  CalculatorIcon,
  DropIcon,
  HeartbeatIcon,
  PersonIcon,
  TargetIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToolCard } from "./ToolCard";

const meta = {
  title: "Content/ToolCard",
  component: ToolCard,
  args: {
    href: "#calorie-calculator",
    icon: CalculatorIcon,
    title: "Calorie calculator",
    line: "Your exact daily calories.",
  },
} satisfies Meta<typeof ToolCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single tile at its bento width. */
const tileWidth: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div style={{ width: "16rem" }}>
      <Story />
    </div>
  ),
];

export const Default: Story = { decorators: tileWidth };
export const Hover: Story = { decorators: tileWidth, parameters: { pseudo: { hover: true } } };
export const Focus: Story = {
  decorators: tileWidth,
  parameters: { pseudo: { focusVisible: ["a"] } },
};

/** home.md section 6: the seven small tiles of the tools bento (screen A3). */
export const SmallTiles: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "min(56rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
      <ToolCard
        href="#1"
        icon={CalculatorIcon}
        title="Calorie calculator"
        line="Your exact daily calories."
      />
      <ToolCard
        href="#2"
        icon={TrendUpIcon}
        title="Weight-gain calculator"
        line="How much to eat to gain."
      />
      <ToolCard href="#3" icon={TargetIcon} title="Protein target" line="Your daily grams." />
      <ToolCard href="#4" icon={HeartbeatIcon} title="BMI" line="Check your healthy range." />
      <ToolCard href="#5" icon={BarbellIcon} title="One-rep max" line="Find your true max." />
      <ToolCard href="#6" icon={PersonIcon} title="Body fat" line="How far to your abs?" />
      <ToolCard href="#7" icon={DropIcon} title="Water" line="How much today?" />
    </div>
  ),
};
