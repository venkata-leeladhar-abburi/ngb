import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ShareCard } from "./ShareCard";

describe("ShareCard", () => {
  it("shows the headline, the result and the signature on the ember gradient", () => {
    const { container } = render(<ShareCard headline="My daily target" value="2,480 kcal" />);

    expect(screen.getByText("My daily target")).toBeInTheDocument();
    expect(screen.getByText("2,480 kcal")).toBeInTheDocument();
    expect(screen.getByText("Built with NGB Evolve")).toBeInTheDocument();
    expect((container.firstElementChild as HTMLElement).style.backgroundImage).toBe(
      "var(--gradient-ember)",
    );
  });
});
