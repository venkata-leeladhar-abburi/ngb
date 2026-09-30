import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioBackdrop } from "../brand/StudioBackdrop";
import { ProgramCard } from "./ProgramCard";
import { cta, includes, programs } from "./programs-fixture";

const meta = {
  title: "Content/ProgramCard",
  component: ProgramCard,
  args: { ...programs[0], cta },
} satisfies Meta<typeof ProgramCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single cards at the width they get in the A5 grid. */
const cardWidth: NonNullable<Story["decorators"]> = [
  (Story) => (
    <div style={{ width: "min(20rem, 100%)" }}>
      <Story />
    </div>
  ),
];

/** Board 08: oxblood card with the bone button. */
export const Standard: Story = { decorators: cardWidth };

/** Board 08: black, red edge, the one glow, gold tag. */
export const Featured: Story = {
  args: { ...programs[1], tag: "Most popular", features: includes },
};

/** Screen A5: four cards on the red studio; only the featured one glows. Prices are [CONFIRM]. */
export const ProgramsGrid: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <StudioBackdrop className="px-page py-64">
        <Story />
      </StudioBackdrop>
    ),
  ],
  render: () => (
    <div className="grid gap-24 md:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
      {programs.map((program) => (
        <ProgramCard
          key={program.name}
          {...program}
          features={includes}
          {...("featured" in program ? { tag: "Most popular" } : {})}
          cta={cta}
        />
      ))}
    </div>
  ),
};

/** Telugu copy for program cards is not written yet (TODO(copy)); existing Telugu lines test fit only. */
export const TeluguFitTest: Story = {
  args: {
    ...programs[1],
    line: "నేను జీరో నుంచి చేశాను.",
    weeksLabel: "వారాలు",
    perDayLabel: "రోజుకు",
    tag: "నీ వంతు",
    featured: true,
  },
  decorators: [
    (Story) => (
      <div lang="te" style={{ width: "min(20rem, 100%)" }}>
        <Story />
      </div>
    ),
  ],
};
