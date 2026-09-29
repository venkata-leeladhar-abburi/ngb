import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LangSwitch } from "./LangSwitch";

describe("LangSwitch", () => {
  it("is a navigation landmark with two language links", () => {
    render(<LangSwitch current="en" enHref="/programs" teHref="/te/programs" />);

    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
    const english = screen.getByRole("link", { name: "EN, English" });
    const telugu = screen.getByRole("link", { name: "తె, తెలుగు" });
    expect(english).toHaveAttribute("aria-current", "true");
    expect(telugu).not.toHaveAttribute("aria-current");
    expect(telugu).toHaveAttribute("href", "/te/programs");
    expect(telugu).toHaveAttribute("lang", "te");
    expect(telugu).toHaveAttribute("hreflang", "te");
  });

  it("marks Telugu as current on Telugu pages", () => {
    render(<LangSwitch current="te" enHref="/" teHref="/te" />);

    expect(screen.getByRole("link", { name: "తె, తెలుగు" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
