import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wordmark } from "./Wordmark";

describe("Wordmark", () => {
  it("reads NGB Evolve, with EVOLVE in studio red on dark grounds", () => {
    render(<Wordmark />);

    expect(screen.getByText("NGB")).toHaveClass("text-primary");
    expect(screen.getByText("Evolve")).toHaveClass("text-brand");
  });

  it("is all bone on studio red", () => {
    render(<Wordmark tone="red" />);

    expect(screen.getByText("Evolve")).toHaveClass("text-primary");
  });
});
