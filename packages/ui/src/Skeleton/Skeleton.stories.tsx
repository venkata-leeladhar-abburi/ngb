import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./Skeleton";

const meta = {
  title: "Core/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A result loading: the region says what is happening in words (voice.md). */
export const ResultLoading: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-96 flex-col gap-12" style={{ width: "20rem" }}>
      <p className="text-muted">Calculating your number…</p>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-128" />
    </div>
  ),
};
