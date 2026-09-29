import { CaretRightIcon, FlameIcon } from "@phosphor-icons/react/ssr";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "./Icon";

describe("Icon", () => {
  it("is hidden from assistive technology when decorative", () => {
    const { container } = render(<Icon icon={CaretRightIcon} />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("svg")).toHaveClass("size-(--icon-md)");
  });

  it("is an image with a name when it carries meaning", () => {
    render(<Icon icon={FlameIcon} label="Calories" size="lg" className="text-accent" />);

    const icon = screen.getByRole("img", { name: "Calories" });
    expect(icon).toHaveClass("size-(--icon-lg)", "text-accent");
  });
});
