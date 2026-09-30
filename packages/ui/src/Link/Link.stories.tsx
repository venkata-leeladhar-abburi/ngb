import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "../Text";
import { Link } from "./Link";

const meta = {
  title: "Core/Link",
  component: Link,
  args: { href: "#story", variant: "standalone", children: "Watch my story (2 min)" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Journey section link (home.md section 3). */
export const Standalone: Story = {};
export const StandaloneHover: Story = { parameters: { pseudo: { hover: ["a"] } } };
export const StandaloneFocus: Story = { parameters: { pseudo: { focusVisible: ["a"] } } };

/** Inside a sentence: underlined, so it never depends on colour (FAQ answer, pages.md). */
export const Inline: Story = {
  render: () => (
    <Text>
      Which plan should I pick?{" "}
      <Link href="/quiz" variant="inline">
        Take the quiz.
      </Link>
    </Text>
  ),
};
export const InlineHover: Story = { ...Inline, parameters: { pseudo: { hover: ["a"] } } };
export const InlineFocus: Story = { ...Inline, parameters: { pseudo: { focusVisible: ["a"] } } };

/** Telugu copy is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: { children: "నీ Day One ఈరోజే" },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
