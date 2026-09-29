import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tag } from "./Tag";

describe("Tag", () => {
  it("is plain text in the gold chamfered tag, not a control", () => {
    const { container } = render(<Tag>Most popular</Tag>);

    expect(screen.getByText("Most popular")).toBeInTheDocument();
    expect(container.querySelector("button, a, [tabindex]")).toBeNull();
    expect(container.querySelector('[data-chamfer="fill"]')).toHaveClass("bg-popular");
    expect(container.querySelector('[data-chamfer="ring"]')).toBeNull();
  });
});
