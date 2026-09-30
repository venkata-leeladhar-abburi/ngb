import { CalculatorIcon } from "@phosphor-icons/react/ssr";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResultCard } from "./ResultCard";

describe("ResultCard", () => {
  it("announces the result politely and shows status with an icon and words", () => {
    render(
      <ResultCard
        icon={CalculatorIcon}
        title="Calorie calculator"
        valueLabel="Your daily target"
        value="2,480 kcal"
        details="Protein: 115 g a day."
        status="Healthy deficit"
        action={{ href: "/programs/shred-12", label: "Get the Shred 12 plan" }}
      />,
    );

    const live = screen.getByText("2,480 kcal").closest("[aria-live]");
    expect(live).toHaveAttribute("aria-live", "polite");
    expect(live).toHaveTextContent("Protein: 115 g a day.");
    expect(screen.getByText("Healthy deficit").previousElementSibling?.tagName).toBe("svg");
    expect(screen.getByRole("link", { name: "Get the Shred 12 plan" })).toHaveAttribute(
      "href",
      "/programs/shred-12",
    );
  });
});
