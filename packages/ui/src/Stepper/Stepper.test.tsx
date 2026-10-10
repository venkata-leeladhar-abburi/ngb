import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Stepper } from "./Stepper";

const labels = { decreaseLabel: "Remove one egg", increaseLabel: "Add one egg" };

describe("Stepper", () => {
  it("adds and removes one", async () => {
    const onChange = vi.fn();
    render(<Stepper value={2} onChange={onChange} {...labels} />);

    await userEvent.click(screen.getByRole("button", { name: "Add one egg" }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole("button", { name: "Remove one egg" }));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("works with the keyboard", async () => {
    const onChange = vi.fn();
    render(<Stepper value={2} onChange={onChange} {...labels} />);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Remove one egg" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(1);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("stops at the limits but keeps the button focusable", async () => {
    const onChange = vi.fn();
    render(<Stepper value={0} min={0} max={0} onChange={onChange} {...labels} />);

    const remove = screen.getByRole("button", { name: "Remove one egg" });
    expect(remove).toHaveAttribute("aria-disabled", "true");
    expect(remove).not.toBeDisabled();
    await userEvent.click(remove);
    await userEvent.click(screen.getByRole("button", { name: "Add one egg" }));
    expect(onChange).not.toHaveBeenCalled();
    remove.focus();
    expect(remove).toHaveFocus();
  });

  it("reads the count with its unit", () => {
    render(<Stepper value={2} onChange={() => undefined} valueLabel="2 portions" {...labels} />);

    expect(screen.getByText("2 portions")).toBeInTheDocument();
  });
});
