import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { perDayPrice, ProgramCard } from "./ProgramCard";
import { cta, programs } from "./programs-fixture";

describe("perDayPrice", () => {
  it("matches the per-day prices in home.md section 9", () => {
    expect(perDayPrice(1499, 8)).toBe(27);
    expect(perDayPrice(1999, 12)).toBe(24);
    expect(perDayPrice(1499, 12)).toBe(18);
  });
});

describe("ProgramCard", () => {
  it("shows name, length, price with Indian grouping and the computed per-day price", () => {
    render(<ProgramCard {...programs[0]} cta={cta} />);

    const card = screen.getByRole("article");
    expect(
      within(card).getByRole("heading", { level: 3, name: "Foundation Plan" }),
    ).toBeInTheDocument();
    expect(within(card).getByText("8 weeks")).toBeInTheDocument();
    expect(within(card).getByText("₹1,499")).toBeInTheDocument();
    expect(within(card).getByText("₹27 a day")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: "Start my plan" })).toHaveAttribute(
      "href",
      "#start",
    );
  });

  it("formats lakhs the Indian way", () => {
    render(<ProgramCard name="1:1 Coaching" weeks={12} priceInr={100000} cta={cta} />);

    expect(screen.getByText("₹1,00,000")).toBeInTheDocument();
  });

  it("gives only the featured card the glow, the tag and the red button", () => {
    render(
      <>
        <ProgramCard {...programs[0]} cta={cta} />
        <ProgramCard
          {...programs[1]}
          tag="Most popular"
          features={["Telugu food diet"]}
          cta={cta}
        />
      </>,
    );

    const [standard, featured] = screen.getAllByRole("article") as [HTMLElement, HTMLElement];
    expect(standard).not.toHaveClass("shadow-sells");
    expect(featured).toHaveClass("shadow-sells");
    expect(within(featured).getByText("Most popular")).toBeInTheDocument();
    expect(within(standard).queryByText("Most popular")).toBeNull();
    expect(within(featured).getByText("Telugu food diet")).toBeInTheDocument();
  });

  it("takes localised words for weeks and per day", () => {
    render(<ProgramCard {...programs[1]} weeksLabel="వారాలు" perDayLabel="రోజుకు" cta={cta} />);

    expect(screen.getByText("12 వారాలు")).toBeInTheDocument();
    expect(screen.getByText("₹24 రోజుకు")).toBeInTheDocument();
  });
});
