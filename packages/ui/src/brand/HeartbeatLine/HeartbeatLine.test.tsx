import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeartbeatLine } from "./HeartbeatLine";

describe("HeartbeatLine", () => {
  it("is decoration only", () => {
    const { container } = render(<HeartbeatLine />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("button, a")).toBeNull();
  });

  it("is bone at 30% by default and signal red on the stat strip", () => {
    const { container, rerender } = render(<HeartbeatLine />);
    expect(container.firstElementChild).toHaveClass("text-primary", "opacity-30");

    rerender(<HeartbeatLine tone="red" />);
    expect(container.firstElementChild).toHaveClass("text-accent");
  });
});
