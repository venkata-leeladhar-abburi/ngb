import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgressSteps } from "./ProgressSteps";

describe("ProgressSteps", () => {
  it("is a named ordered list with the current step marked", () => {
    render(
      <ProgressSteps label="Checkout steps" steps={["Your phone number", "Pay"]} current={1} />,
    );

    expect(screen.getByRole("navigation", { name: "Checkout steps" })).toBeInTheDocument();
    const [first, second] = screen.getAllByRole("listitem");
    expect(second).toHaveAttribute("aria-current", "step");
    expect(first).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();
  });

  it("tells screen readers which steps are done, not just the icon", () => {
    render(
      <ProgressSteps label="Quiz progress" steps={["Goal", "Where", "Experience"]} current={2} />,
    );

    const [goal, where, experience] = screen.getAllByRole("listitem");
    expect(goal).toHaveTextContent("Goal, done");
    expect(where).toHaveTextContent("Where, done");
    expect(experience).not.toHaveTextContent("done");
  });
});
