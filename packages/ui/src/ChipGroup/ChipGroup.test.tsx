import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ChipGroup } from "./ChipGroup";

const focus = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "legs", label: "Legs" },
  { value: "home", label: "Home" },
];

describe("ChipGroup", () => {
  it("is a named radio group of chamfered chips", () => {
    render(<ChipGroup label="Training focus" options={focus} defaultValue="chest" />);

    expect(screen.getByRole("radiogroup", { name: "Training focus" })).toBeInTheDocument();
    const chest = screen.getByRole("radio", { name: "Chest" });
    expect(chest).toBeChecked();
    expect(chest.querySelector('[data-chamfer="fill"]')).not.toBeNull();
  });

  it("can hide its label visually but keep the name", () => {
    render(<ChipGroup label="Filter results" hideLabel options={focus} />);

    expect(screen.getByText("Filter results")).toHaveClass("sr-only");
    expect(screen.getByRole("radiogroup", { name: "Filter results" })).toBeInTheDocument();
  });

  it("moves with arrow keys (wrapping), selects with Space and with clicks", async () => {
    const user = userEvent.setup();
    render(<ChipGroup label="Training focus" options={focus} defaultValue="chest" />);

    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Home" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Home" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Back" }));
    expect(screen.getByRole("radio", { name: "Back" })).toBeChecked();
  });
});
