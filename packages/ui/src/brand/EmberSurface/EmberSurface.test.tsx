import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmberSurface } from "./EmberSurface";

describe("EmberSurface", () => {
  it("is an ember card that keeps content at the bottom, on the dark zone", () => {
    const { container } = render(<EmberSurface>Text</EmberSurface>);

    const surface = container.firstElementChild as HTMLElement;
    expect(surface.style.backgroundImage).toBe("var(--gradient-ember)");
    expect(surface).toHaveClass("flex", "flex-col", "justify-end");
  });

  it("draws the glow on the page ground", () => {
    const { container } = render(<EmberSurface as="section" variant="glow" />);

    const surface = container.firstElementChild as HTMLElement;
    expect(surface.tagName).toBe("SECTION");
    expect(surface.style.backgroundImage).toBe("var(--gradient-glow)");
    expect(surface).toHaveClass("bg-page");
  });
});
