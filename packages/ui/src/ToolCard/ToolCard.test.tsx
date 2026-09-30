import { CalculatorIcon } from "@phosphor-icons/react/ssr";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToolCard } from "./ToolCard";

describe("ToolCard", () => {
  it("is one link named by the tool and its line, with decorative icons", () => {
    render(
      <ToolCard
        href="/tools/calorie-calculator"
        icon={CalculatorIcon}
        title="Calorie calculator"
        line="Your exact daily calories."
      />,
    );

    const link = screen.getByRole("link", {
      name: "Calorie calculator Your exact daily calories.",
    });
    expect(link).toHaveAttribute("href", "/tools/calorie-calculator");
    for (const svg of link.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("large: one link, with the call to action inside it and no nested control", () => {
    render(
      <ToolCard
        size="large"
        href="/tools/telugu-plate"
        icon={CalculatorIcon}
        title="Telugu Plate protein counter."
        line="Tap your meal."
        action="Count my plate"
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName(/Count my plate/);
  });
});
