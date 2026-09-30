import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentPropsWithoutRef } from "react";
import { describe, expect, it } from "vitest";

import { Link } from "./Link";

describe("Link", () => {
  it("is a link named by its text; the standalone caret adds nothing to the name", () => {
    render(
      <Link href="#story" variant="standalone">
        Watch my story (2 min)
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Watch my story (2 min)" });
    expect(link).toHaveAttribute("href", "#story");
    expect(link).toHaveClass("min-h-target");
  });

  it("is underlined inside a sentence", () => {
    render(<Link href="/quiz">Take the quiz.</Link>);

    expect(screen.getByRole("link", { name: "Take the quiz." })).toHaveClass("underline");
  });

  it("renders through a router link component and takes keyboard focus", async () => {
    function RouterLink({ children, ...props }: ComponentPropsWithoutRef<"a">) {
      return (
        <a data-router="" {...props}>
          {children}
        </a>
      );
    }
    render(
      <Link as={RouterLink} href="/quiz">
        Take the quiz.
      </Link>,
    );

    await userEvent.tab();
    const link = screen.getByRole("link", { name: "Take the quiz." });
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveFocus();
  });
});
