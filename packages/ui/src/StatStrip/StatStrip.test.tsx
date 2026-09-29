import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatStrip } from "./StatStrip";

describe("StatStrip", () => {
  it("renders the real numbers straight away, formatted, with placeholders left visible", () => {
    render(
      <StatStrip
        stats={[
          { value: 1_000_000, compact: true, suffix: "+", label: "Instagram" },
          { value: 2022, countUp: false, label: "Day one" },
          { placeholder: "[REAL DATA]", label: "Members coached" },
          { value: 100, suffix: "%", label: "Telugu + English" },
        ]}
      />,
    );

    for (const text of ["1M+", "2022", "100%"]) {
      expect(screen.getAllByText(text)).toHaveLength(2);
    }
    expect(screen.getAllByText("[REAL DATA]")).toHaveLength(2);
    expect(screen.getByText("Instagram")).toBeInTheDocument();
  });

  it("gives screen readers the final value once and hides the animated copy", () => {
    render(<StatStrip stats={[{ value: 100, suffix: "%", label: "Telugu + English" }]} />);

    const [animated, spoken] = screen.getAllByText("100%");
    expect(animated).toHaveAttribute("aria-hidden", "true");
    expect(spoken).toHaveClass("sr-only");
  });
});
