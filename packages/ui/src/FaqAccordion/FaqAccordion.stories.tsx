import type { Meta, StoryObj } from "@storybook/react-vite";

import { FaqAccordion } from "./FaqAccordion";
import { faqs } from "./faq-fixture";

const meta = {
  title: "Content/FaqAccordion",
  component: FaqAccordion,
  args: { items: faqs },
  decorators: [
    (Story) => (
      <div style={{ width: "min(36rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 08 and home.md section 10: the first answer open. */
export const FirstOpen: Story = { args: { defaultOpen: 0 } };
export const AllClosed: Story = {};
export const QuestionHover: Story = {
  parameters: { pseudo: { hover: ['[data-state="closed"] button'] } },
};

/** Telugu FAQ copy is not written yet (TODO(copy)); existing Telugu lines test fit only. */
export const TeluguFitTest: Story = {
  args: {
    items: [
      { question: "నీ goal ఏంటి?", answer: "నేను జీరో నుంచి చేశాను. ఇప్పుడు నీ వంతు." },
      { question: "నీ Day One ఈరోజే.", answer: "నేను జీరో నుంచి చేశాను." },
    ],
  },
  decorators: [
    (Story) => (
      <div lang="te" style={{ width: "min(36rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
};
