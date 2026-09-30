import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

const consent =
  "I agree to get my plan and fitness tips from NGB Evolve on WhatsApp. I can stop anytime.";

describe("Checkbox", () => {
  it("is an unticked checkbox named by its label (consent starts unticked)", () => {
    render(<Checkbox label={consent} />);

    expect(screen.getByRole("checkbox", { name: consent })).not.toBeChecked();
  });

  it("toggles with Space and by clicking the label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label={consent} onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox");
    await user.tab();
    await user.keyboard(" ");
    expect(box).toBeChecked();
    await user.click(screen.getByText(consent));
    expect(box).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("submits with a form and reports errors in words", () => {
    const { container } = render(
      <form>
        <Checkbox
          label={consent}
          name="consent"
          value="yes"
          defaultChecked
          error="Tick this to get your plan."
        />
      </form>,
    );

    const form = container.querySelector("form");
    if (!form) throw new Error("form not rendered");
    expect(new FormData(form).get("consent")).toBe("yes");
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription("Tick this to get your plan.");
  });
});
