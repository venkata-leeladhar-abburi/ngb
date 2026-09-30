import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { TransformationCard } from "./TransformationCard";

const meta = {
  title: "Content/TransformationCard",
  component: TransformationCard,
  args: { name: "Name", town: "Town", weeks: 12, change: "+X kg" },
  decorators: [
    (Story) => (
      <div style={{ width: "min(18rem, calc(100vw - 4rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransformationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Board 08. People stay placeholders until consented results are in the CMS (screens.md, A4). */
export const Default: Story = {};
export const SliderFocus: Story = { parameters: { pseudo: { focusVisible: ['[role="slider"]'] } } };

/** Real browser: one tap (no drag) moves the divider there (WCAG 2.5.7). */
export const TapToMove: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole("slider", { name: "Before and after" });
    const track = canvasElement.querySelector<HTMLElement>('[data-orientation="horizontal"]');
    if (!track) throw new Error("Slider track not found");
    // The photos take the tap (the track itself ignores the pointer so swipes scroll the row).
    const photos = track.parentElement;
    if (!photos) throw new Error("Photo area not found");
    const box = track.getBoundingClientRect();
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: photos,
      coords: { clientX: box.left + box.width * 0.2, clientY: box.top + box.height / 2 },
    });
    await expect(Number(slider.getAttribute("aria-valuenow"))).toBeLessThan(35);
  },
};

/** Telugu labels are not written yet (TODO(copy)); existing Telugu words test fit only. */
export const TeluguFitTest: Story = {
  args: { weeksLabel: "వారాలు", permissionLabel: "నీ వంతు", sliderLabel: "నీ Day One" },
  decorators: [
    (Story) => (
      <div lang="te">
        <Story />
      </div>
    ),
  ],
};
