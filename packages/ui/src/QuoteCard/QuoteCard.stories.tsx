import type { Meta, StoryObj } from "@storybook/react-vite";

import { QuoteCard } from "./QuoteCard";

const meta = {
  title: "Content/QuoteCard",
  component: QuoteCard,
  args: { quote: "If I could do it, you can too.", by: "Nawin" },
  // Padded with a max width, so the story also fits a narrow Docs page (100vw would not).
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "36rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuoteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** home.md section 3 (screen A2). Member quotes are [REAL DATA] and come from the CMS. */
export const English: Story = {};

/** home.md section 3, Telugu [TE REVIEW]. */
export const Telugu: Story = {
  args: { quote: "నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు.", lang: "te" },
};
