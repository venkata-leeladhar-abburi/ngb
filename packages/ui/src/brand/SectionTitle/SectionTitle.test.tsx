import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("is an h2 named only by its title", () => {
    render(<SectionTitle speedLines>Pick your plan.</SectionTitle>);

    const heading = screen.getByRole("heading", { level: 2, name: "Pick your plan." });
    expect(heading.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(heading.querySelector("[data-slash]")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the heading level it is given", () => {
    render(<SectionTitle as="h1">Programs</SectionTitle>);

    expect(screen.getByRole("heading", { level: 1, name: "Programs" })).toBeInTheDocument();
  });

  it("draws speed lines only when asked", () => {
    render(<SectionTitle>Free tools. Real numbers.</SectionTitle>);

    expect(screen.getByRole("heading").querySelector("svg")).toBeNull();
  });
});
