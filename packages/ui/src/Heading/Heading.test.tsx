import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Heading } from "./Heading";

describe("Heading", () => {
  it("keeps the outline level separate from the look", () => {
    render(
      <Heading as="h3" variant="display">
        Start today
      </Heading>,
    );

    const heading = screen.getByRole("heading", { level: 3, name: "Start today" });
    expect(heading).toHaveClass("font-display", "text-display");
  });

  it("uses studio red only on large roles", () => {
    render(
      <>
        <Heading as="h2" variant="h1" tone="brand">
          Free tools
        </Heading>
        <Heading as="h3" variant="h3" tone="brand">
          Calorie calculator
        </Heading>
      </>,
    );

    expect(screen.getByRole("heading", { name: "Free tools" })).toHaveClass("text-brand");
    // Studio red is below 4.5:1 at h3 size, so the tone is ignored there.
    expect(screen.getByRole("heading", { name: "Calorie calculator" })).toHaveClass("text-primary");
  });
});
