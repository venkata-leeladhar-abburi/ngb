import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./SegmentedControl";

const goals = [
  { value: "lose", label: "Lose fat" },
  { value: "same", label: "Stay the same" },
  { value: "gain", label: "Gain weight" },
];

describe("SegmentedControl", () => {
  it("is a named radio group with one checked segment", () => {
    render(<SegmentedControl label="Your goal" options={goals} defaultValue="lose" />);

    expect(screen.getByRole("radiogroup", { name: "Your goal" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Lose fat" })).toBeChecked();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  // Selecting on arrow needs real browser focus timing; the KeyboardSelect story checks it in Chromium.
  it("moves focus with the arrow keys and selects with Space", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        label="Your goal"
        options={goals}
        defaultValue="lose"
        onValueChange={onValueChange}
      />,
    );

    await user.tab();
    expect(screen.getByRole("radio", { name: "Lose fat" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Stay the same" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Stay the same" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("same");
  });

  it("selects on click", async () => {
    const user = userEvent.setup();
    render(<SegmentedControl label="Your goal" options={goals} />);

    await user.click(screen.getByRole("radio", { name: "Gain weight" }));
    expect(screen.getByRole("radio", { name: "Gain weight" })).toBeChecked();
  });
});
