import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs } from "./Tabs";

const items = [
  { value: "hostel", label: "Hostel day", content: "4 idli, 2 boiled eggs, a glass of milk" },
  { value: "home", label: "Home day", content: "Home version" },
];

describe("Tabs", () => {
  it("names the tab list and shows the first panel", () => {
    render(<Tabs label="Food plan" items={items} />);

    expect(screen.getByRole("tablist", { name: "Food plan" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Hostel day" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("4 idli");
  });

  it("moves between tabs with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs label="Food plan" items={items} />);

    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Home day" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Home day" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Home version");
  });
});
