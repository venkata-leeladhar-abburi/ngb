import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Select } from "./Select";

const activity = [
  { value: "sitting", label: "Mostly sitting" },
  { value: "light", label: "Light exercise" },
  { value: "train", label: "Train 3–5 days" },
  { value: "very", label: "Very active" },
];

describe("Select", () => {
  it("is a native select labelled from above, with an empty first choice", () => {
    render(<Select label="Activity" options={activity} placeholder="Choose one" />);

    const select = screen.getByRole("combobox", { name: "Activity" });
    expect(select.tagName).toBe("SELECT");
    expect(screen.getAllByRole("option")).toHaveLength(5);
    expect(select).toHaveValue("");
  });

  it("changes value and reports errors in words", async () => {
    const user = userEvent.setup();
    render(<Select label="Activity" options={activity} error="Please choose your activity." />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "train");
    expect(select).toHaveValue("train");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Please choose your activity.");
  });
});
