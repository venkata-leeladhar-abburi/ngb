import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StudioBackdrop } from "./StudioBackdrop";

describe("StudioBackdrop", () => {
  it("paints the red studio behind bone text", () => {
    render(
      <StudioBackdrop as="section" aria-label="Programs">
        Content
      </StudioBackdrop>,
    );

    const section = screen.getByRole("region", { name: "Programs" });
    expect(section).toHaveClass("bg-brand", "text-primary");
    expect(section.style.backgroundImage).toBe("var(--gradient-studio)");
  });

  it("uses the plain ground at night", () => {
    const { container } = render(<StudioBackdrop variant="night" />);

    const backdrop = container.firstElementChild as HTMLElement;
    expect(backdrop).toHaveClass("bg-page");
    expect(backdrop.style.backgroundImage).toBe("");
  });
});
