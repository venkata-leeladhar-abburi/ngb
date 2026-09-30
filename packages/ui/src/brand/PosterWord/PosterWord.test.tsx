import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PosterWord } from "./PosterWord";

describe("PosterWord", () => {
  it("is decorative: hidden from screen readers and ignores the pointer", () => {
    const { container } = render(<PosterWord>Evolve</PosterWord>);
    const word = container.firstElementChild;

    expect(word).toHaveAttribute("aria-hidden", "true");
    expect(word).toHaveClass("pointer-events-none", "whitespace-nowrap", "text-mega");
  });

  it("slides in only when asked, and never with reduced motion", () => {
    const { container } = render(<PosterWord animate>Evolve</PosterWord>);

    expect(container.firstElementChild?.className).toContain("ngb-poster-in");
    expect(container.firstElementChild?.className).toContain("motion-reduce:[animation:none]");
  });
});
