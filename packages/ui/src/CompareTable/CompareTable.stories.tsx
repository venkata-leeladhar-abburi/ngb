import type { Meta, StoryObj } from "@storybook/react-vite";

import { CompareTable } from "./CompareTable";

const cta = { href: "#buy", label: "Start my plan" };

const meta = {
  title: "Content/CompareTable",
  component: CompareTable,
  parameters: { layout: "padded" },
  // pages.md: Programs and the variants table. Prices and "where" are [CONFIRM].
  args: {
    caption: "Compare the plans",
    columns: [
      { name: "Foundation Plan", cta },
      { name: "Shred 12", featured: true, cta },
      { name: "Mass Builder", cta },
      { name: "Master the Bodyweight", cta },
    ],
    rows: [
      { label: "Weeks", cells: [8, 12, 12, 12] },
      { label: "Days per week", cells: [3, "4-5", 4, 4] },
      { label: "Minutes per session", cells: [40, 45, 60, 45] },
      { label: "Home or gym", cells: ["Home or gym", "Gym", "Gym", "Home"], words: true },
      { label: "Hostel version", cells: [true, true, true, true] },
      { label: "Price", cells: ["₹1,499", "₹1,999", "₹1,999", "₹1,499"] },
    ],
  },
} satisfies Meta<typeof CompareTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Screen B1: the featured column carries the red edge and the oxblood tint. */
export const Default: Story = {};

/** No column recommended. */
export const NoFeatured: Story = {
  args: { columns: meta.args.columns.map(({ name }) => ({ name, cta })) },
};

/** A fact one program lacks: the dash is read as "No". */
export const WithNo: Story = {
  args: {
    rows: [
      ...meta.args.rows.slice(0, 4),
      { label: "Hostel version", cells: [true, true, true, false] },
    ],
  },
};

/** 360 px: the table scrolls sideways inside its own region; the page does not. */
export const Phone: Story = {
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "phone", isRotated: false } },
};

/** Keyboard focus on the scroll region. */
export const Focus: Story = { parameters: { pseudo: { focusVisible: ["[role=region]"] } } };

/** Telugu copy is not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
  args: {
    caption: "ప్లాన్",
    rows: [
      { label: "వారాలు", cells: [8, 12, 12, 12] },
      { label: "రోజులు", cells: [3, "4-5", 4, 4] },
    ],
  },
};
