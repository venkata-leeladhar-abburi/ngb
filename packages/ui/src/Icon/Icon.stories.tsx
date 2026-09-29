import {
  BarbellIcon,
  CalculatorIcon,
  CheckCircleIcon,
  FlameIcon,
  ForkKnifeIcon,
  HeartbeatIcon,
  LockIcon,
  PlayIcon,
  TimerIcon,
  UserIcon,
} from "@phosphor-icons/react/ssr";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "./Icon";

const meta = {
  title: "Core/Icon",
  component: Icon,
  args: { icon: BarbellIcon },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Board 06: 16, 20, 24 and 32 px. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-32">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Icon key={size} icon={BarbellIcon} size={size} />
      ))}
    </div>
  ),
};

/** Board 06 set. Only the flame may be signal red. */
export const Set: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-24">
      {[
        BarbellIcon,
        TimerIcon,
        ForkKnifeIcon,
        CalculatorIcon,
        PlayIcon,
        LockIcon,
        HeartbeatIcon,
        CheckCircleIcon,
        UserIcon,
      ].map((glyph, index) => (
        <Icon key={index} icon={glyph} size="lg" />
      ))}
      <Icon icon={FlameIcon} size="lg" className="text-accent" />
    </div>
  ),
};
