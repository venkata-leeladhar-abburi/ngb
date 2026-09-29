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
    expect(telugu).toHaveAttribute("hreflang", "te-IN");
    expect(english).toHaveAttribute("hreflang", "en-IN");
  });

  it("marks Telugu as current on Telugu pages", () => {
    render(<LangSwitch current="te" enHref="/" teHref="/te" />);

    expect(screen.getByRole("link", { name: "తె, తెలుగు" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("has an inline style for headers that keeps the same links and names", () => {
    render(<LangSwitch current="en" enHref="/" teHref="/te" variant="inline" />);

    const english = screen.getByRole("link", { name: "EN, English" });
    expect(english).toHaveAttribute("aria-current", "true");
    expect(english).toHaveClass("text-primary");
    expect(screen.getByRole("link", { name: "తె, తెలుగు" })).toHaveClass("text-muted");
  });

  it("never uses muted text on red", () => {
    render(<LangSwitch current="en" enHref="/" teHref="/te" variant="inline" tone="red" />);

    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveClass("text-muted");
      expect(link).toHaveClass("text-primary");
    }
  });
});
