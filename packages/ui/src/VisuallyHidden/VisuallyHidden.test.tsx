import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("keeps the text available to assistive technology", () => {
    render(
      <button type="button">
        <VisuallyHidden>Play Nawin's story</VisuallyHidden>
      </button>,
    );

    expect(screen.getByRole("button", { name: "Play Nawin's story" })).toBeInTheDocument();
  });

  it("renders a span by default and the element passed in `as`", () => {
    const { container } = render(
      <>
        <VisuallyHidden>Default</VisuallyHidden>
        <VisuallyHidden as="a" href="#main">
          Link
        </VisuallyHidden>
      </>,
    );

    expect(container.querySelector("span")).toHaveTextContent("Default");
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute("href", "#main");
  });

  it("stays hidden when not focusable", () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);

    expect(screen.getByText("Hidden")).toHaveClass("sr-only");
    expect(screen.getByText("Hidden")).not.toHaveClass("focus:not-sr-only");
  });

  it("can be reached by keyboard when focusable (skip link)", async () => {
    const user = userEvent.setup();
    render(
      <VisuallyHidden as="a" href="#main" focusable>
        Skip to content
      </VisuallyHidden>,
    );

    await user.tab();

    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveFocus();
    expect(link).toHaveClass("focus:not-sr-only");
  });
});
