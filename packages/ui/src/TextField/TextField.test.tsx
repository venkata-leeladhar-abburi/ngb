import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TextField } from "./TextField";

describe("TextField", () => {
  it("is labelled from above and described by its hint", () => {
    render(<TextField label="Weight (kg)" hint="Used only for your result." inputMode="decimal" />);

    const input = screen.getByRole("textbox", { name: "Weight (kg)" });
    expect(input).toHaveAccessibleDescription("Used only for your result.");
    expect(input).toHaveAttribute("inputmode", "decimal");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("shows the error with an icon and words instead of the hint, and marks the field invalid", () => {
    render(
      <TextField
        label="Weight (kg)"
        hint="Used only for your result."
        error="Enter a weight between 30 and 200 kg."
      />,
    );

    const input = screen.getByRole("textbox", { name: "Weight (kg)" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a weight between 30 and 200 kg.");
    expect(screen.queryByText("Used only for your result.")).toBeNull();
    const message = screen.getByText("Enter a weight between 30 and 200 kg.").parentElement;
    expect(message?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("takes typing and keeps a given id", async () => {
    const user = userEvent.setup();
    render(<TextField label="Name" id="name" />);

    const input = screen.getByLabelText("Name");
    await user.type(input, "Arun");
    expect(input).toHaveValue("Arun");
    expect(input).toHaveAttribute("id", "name");
  });
});
