import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StickyActionBar, StickyBuyBar } from "./StickyBar";

describe("StickyBuyBar", () => {
  it("shows the program, its price and the per-day price next to it (CLAUDE.md)", () => {
    render(
      <StickyBuyBar
        visible
        name="Mass Builder"
        priceInr={1999}
        weeks={12}
        cta={{ href: "#buy", label: "Start my plan" }}
      />,
    );

    const bar = screen.getByRole("complementary", { name: "Buy" });
    expect(bar).toHaveTextContent("Mass Builder");
    expect(bar).toHaveTextContent("₹1,999");
    expect(bar).toHaveTextContent("₹24 a day");
    expect(screen.getByRole("link", { name: "Start my plan" })).toHaveAttribute("href", "#buy");
  });

  it("is inert and out of reach while hidden", () => {
    render(
      <StickyBuyBar
        visible={false}
        name="Mass Builder"
        priceInr={1999}
        weeks={12}
        cta={{ href: "#buy", label: "Start my plan" }}
      />,
    );

    const bar = screen.getByRole("complementary", { hidden: true });
    expect(bar).toHaveAttribute("inert");
    expect(bar).toHaveClass("translate-y-full");
  });
});

describe("StickyActionBar", () => {
  it("offers the buy action and the free action with the approved labels", () => {
    render(
      <StickyActionBar
        visible
        primary={{ href: "#start", label: "Start my plan" }}
        secondary={{ href: "#tools", label: "Try free tools" }}
      />,
    );

    expect(screen.getByRole("link", { name: "Start my plan" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try free tools" })).toBeInTheDocument();
  });
});
