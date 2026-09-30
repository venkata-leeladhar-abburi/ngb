import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SwipeRow } from "./SwipeRow";

describe("SwipeRow", () => {
  it("is a named region with a focusable list, one item per card", () => {
    render(<SwipeRow label="Member results" items={[<p key="a">One</p>, <p key="b">Two</p>]} />);

    expect(screen.getByRole("region", { name: "Member results" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("list")).toHaveAttribute("tabindex", "0");
  });

  it("keeps the end buttons focusable, marked aria-disabled, and does nothing on click", async () => {
    const scrollBy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: scrollBy,
    });
    render(
      <SwipeRow label="Member results" previousLabel="Previous" items={[<p key="a">One</p>]} />,
    );

    const previous = screen.getByRole("button", { name: "Previous" });
    expect(previous).toHaveAttribute("aria-disabled", "true");
    expect(previous).not.toBeDisabled();
    await userEvent.click(previous);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("scrolls by most of a screen with the next button", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const scrollBy = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollBy", {
      configurable: true,
      value: scrollBy,
    });
    // jsdom has no layout: make the row three screens wide so "Next" is enabled.
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 100,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => 300,
    });
    render(
      <SwipeRow label="Member results" nextLabel="Next results" items={[<p key="a">One</p>]} />,
    );

    const next = screen.getByRole("button", { name: "Next results" });
    expect(next).toHaveAttribute("aria-disabled", "false");
    await userEvent.click(next);
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
    vi.unstubAllGlobals();
  });
});
