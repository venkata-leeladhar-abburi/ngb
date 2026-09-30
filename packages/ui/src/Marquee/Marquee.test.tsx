import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Marquee } from "./Marquee";

const items = [
  <a key="1" href="#1">
    Photo one
  </a>,
  <a key="2" href="#2">
    Photo two
  </a>,
];

describe("Marquee", () => {
  it("lists each item once for assistive technology; the loop copy is hidden and unfocusable", () => {
    render(<Marquee label="Community" items={items} />);

    const region = screen.getByRole("region", { name: "Community" });
    expect(within(region).getAllByRole("link")).toHaveLength(2);
    const [, copy] = region.querySelectorAll("ul");
    expect(copy).toHaveAttribute("aria-hidden", "true");
    expect(copy).toHaveAttribute("inert");
  });

  it("has a Pause button that becomes Play", async () => {
    const user = userEvent.setup();
    render(<Marquee label="Community" items={items} />);

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
