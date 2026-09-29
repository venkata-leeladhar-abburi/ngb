import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TransformationCard } from "./TransformationCard";

const member = { name: "Name", town: "Town", weeks: 12, change: "+X kg" };

describe("TransformationCard", () => {
  it("names the member, the time and the change, and credits permission", () => {
    render(<TransformationCard {...member} />);

    expect(screen.getByRole("heading", { name: "Name, Town" })).toBeInTheDocument();
    expect(screen.getByText("12 weeks / +X kg")).toBeInTheDocument();
    expect(screen.getByText("Shared with permission")).toBeInTheDocument();
  });

  it("has a labelled slider that starts in the middle and says what it shows", () => {
    render(<TransformationCard {...member} />);

    const slider = screen.getByRole("slider", { name: "Before and after" });
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(slider).toHaveAttribute("aria-valuetext", "50% before, 50% after");
  });

  it("moves with the arrow keys and Home/End", async () => {
    const user = userEvent.setup();
    render(<TransformationCard {...member} />);

    const slider = screen.getByRole("slider");
    await user.tab();
    expect(slider).toHaveFocus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "52");
    await user.keyboard("{End}");
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    await user.keyboard("{Home}");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  it("labels its placeholders until real, consented photos exist", () => {
    render(<TransformationCard {...member} />);

    expect(screen.getByText("Before photo")).toBeInTheDocument();
    expect(screen.getByText("After photo")).toBeInTheDocument();
  });
});
