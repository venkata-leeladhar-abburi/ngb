import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from "./Tabs";

const meta = {
  title: "Core/Tabs",
  component: Tabs,
  args: {
    label: "Food plan",
    items: [
      {
        value: "hostel",
        label: "Hostel day",
        content: (
          <ul className="flex flex-col gap-8">
            <li>Breakfast: 4 idli, 2 boiled eggs, a glass of milk</li>
            <li>Lunch: Rice, pappu, curd, egg curry</li>
            <li>Evening: A handful of peanuts and a banana</li>
          </ul>
        ),
      },
      {
        value: "home",
        label: "Home day",
        content: <p>TODO(copy): home day plan from pages.md.</p>,
      },
    ],
  },
  // Padded with a max width, so the story also fits a narrow Docs page (100vw would not).
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "36rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** pages.md program detail (screen B3): Mass Builder hostel day. */
export const FoodPlan: Story = {};
export const TabFocus: Story = {
  parameters: { pseudo: { focusVisible: ['[role="tab"][data-state="active"]'] } },
};
