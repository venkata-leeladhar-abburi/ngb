import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PriceOption } from "./PriceOption";

describe("PriceOption", () => {
  it("shows the price with the rupee sign, its period and the note", () => {
    render(<PriceOption priceInr={3999} period="a year" note="save 33%" />);

    expect(screen.getByText("₹3,999")).toHaveAttribute("lang", "en");
    expect(screen.getByText("a year")).toBeInTheDocument();
    expect(screen.getByText("save 33%")).toBeInTheDocument();
  });

  it("uses Indian grouping and leaves the note out when there is none", () => {
    const { container } = render(<PriceOption priceInr={100000} period="a year" />);

    expect(screen.getByText("₹1,00,000")).toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
