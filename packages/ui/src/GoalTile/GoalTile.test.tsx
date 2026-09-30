import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GoalTile } from "./GoalTile";

describe("GoalTile", () => {
  it("is one link to the program, with the goal as a heading", () => {
    render(
      <GoalTile
        href="/programs/mass-builder"
        title="Gain weight"
        line="Skinny? Build real size."
      />,
    );

    const link = screen.getByRole("link", { name: /Gain weight/ });
    expect(link).toHaveAttribute("href", "/programs/mass-builder");
    expect(screen.getByRole("heading", { level: 3, name: "Gain weight" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("keeps the placeholder photo out of the link's name", () => {
    render(
      <GoalTile
        href="#"
        title="Lose fat"
        line="Lose the belly."
        placeholderLabel="Photo (pending)"
      />,
    );

    expect(screen.getByRole("link")).toHaveAccessibleName("Lose fat Lose the belly.");
  });
});
