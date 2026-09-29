import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("is a switch named by its visible label", () => {
    render(<Toggle label="I eat in a hostel or mess" />);

    expect(screen.getByRole("switch", { name: "I eat in a hostel or mess" })).not.toBeChecked();
  });

  it("toggles with Space, and by clicking the label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle label="I eat in a hostel or mess" onCheckedChange={onCheckedChange} />);

    const toggle = screen.getByRole("switch");
    await user.tab();
    await user.keyboard(" ");
    expect(toggle).toBeChecked();
    await user.click(screen.getByText("I eat in a hostel or mess"));
    expect(toggle).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("has no circles: the knob is square and the track is chamfered", () => {
    render(<Toggle label="Hostel" />);

    const toggle = screen.getByRole("switch");
    expect(toggle.querySelector('[data-chamfer="fill"]')).not.toBeNull();
    expect(toggle.innerHTML).not.toContain("rounded-full");
  });
});
