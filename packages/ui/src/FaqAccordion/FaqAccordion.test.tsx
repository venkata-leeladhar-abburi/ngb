import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FaqAccordion } from "./FaqAccordion";
import { faqs } from "./faq-fixture";

describe("FaqAccordion", () => {
  it("puts each question in a heading with a button that reports its state", () => {
    render(<FaqAccordion items={faqs} defaultOpen={0} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(
      screen.getByRole("button", { name: "I'm in a hostel. Will this work?" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Do I need supplements?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText(/mess food plus eggs/)).toBeVisible();
  });

  it("opens one answer at a time and can close it again", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={faqs} defaultOpen={0} />);

    await user.click(screen.getByRole("button", { name: "How do I pay?" }));
    expect(screen.getByText(/GST invoice/)).toBeVisible();
    expect(screen.queryByText(/mess food plus eggs/)).toBeNull();

    await user.click(screen.getByRole("button", { name: "How do I pay?" }));
    expect(screen.queryByText(/GST invoice/)).toBeNull();
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={faqs} />);

    await user.tab();
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("button", { name: "I'm in a hostel. Will this work?" }),
    ).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Do I need supplements?" })).toHaveFocus();
  });
});
