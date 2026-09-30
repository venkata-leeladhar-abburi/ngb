import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioBackdrop } from "../brand/StudioBackdrop";
import { PlayButton } from "./PlayButton";

const meta = {
  title: "Core/PlayButton",
  component: PlayButton,
  args: { label: "Play the 30-second journey clip" },
} satisfies Meta<typeof PlayButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Action: Story = {};
export const Hover: Story = { parameters: { pseudo: { hover: ["button"] } } };
export const Focus: Story = { parameters: { pseudo: { focusVisible: ["button"] } } };
export const Pressed: Story = { parameters: { pseudo: { active: ["button"] } } };
/** The clip is not available yet. */
export const Disabled: Story = { args: { disabled: true } };

/** Screen A1: bone on the red studio, where a red button would disappear. */
export const OnRed: Story = {
  args: { tone: "bone" },
  decorators: [
    (Story) => (
      <StudioBackdrop className="p-48">
        <Story />
      </StudioBackdrop>
    ),
  ],
};
export const OnRedFocus: Story = {
  ...OnRed,
  parameters: { pseudo: { focusVisible: ["button"] } },
};
export const OnRedPressed: Story = {
  ...OnRed,
  parameters: { pseudo: { active: ["button"] } },
};
