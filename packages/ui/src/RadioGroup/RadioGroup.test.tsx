import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "./RadioGroup";

const training = [
  { value: "gym", label: "Gym" },
  { value: "home", label: "Home" },
  { value: "both", label: "Both" },
];

describe("RadioGroup", () => {
  it("is a radio group named by the question, with nothing chosen at first", () => {
    render(<RadioGroup label="Where will you train?" options={training} />);

    expect(screen.getByRole("radiogroup", { name: "Where will you train?" })).toBeInTheDocument();
    for (const radio of screen.getAllByRole("radio")) expect(radio).not.toBeChecked();
  });

  it("keeps the name when the label is hidden", () => {
    render(<RadioGroup label="Where will you train?" hideLabel options={training} />);

    expect(screen.getByRole("radiogroup", { name: "Where will you train?" })).toBeInTheDocument();
  });

  it("chooses by click and by Space after arrowing", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Where will you train?"
        options={training}
        defaultValue="gym"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Both" }));
    expect(onValueChange).toHaveBeenLastCalledWith("both");

    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Home" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Home" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("home");
  });

  it("links the error to the group and marks it invalid", () => {
    render(<RadioGroup label="Where will you train?" options={training} error="Pick one answer" />);

    const group = screen.getByRole("radiogroup", { name: "Where will you train?" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Pick one answer");
  });

  it("cannot be changed when disabled", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup label="Where will you train?" options={training} defaultValue="gym" disabled />,
    );

    await user.click(screen.getByRole("radio", { name: "Home" }));
    expect(screen.getByRole("radio", { name: "Gym" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Home" })).toBeDisabled();
  });
});
