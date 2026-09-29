import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./Footer";
import { footerFixture } from "./footer-fixture";

describe("Footer", () => {
  it("is the page footer with named link groups", () => {
    render(<Footer {...footerFixture} />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    for (const name of ["Programs", "Free tools", "Help", "Follow", "Language"]) {
      expect(screen.getByRole("navigation", { name })).toBeInTheDocument();
    }
    const help = screen.getByRole("navigation", { name: "Help" });
    expect(within(help).getByRole("link", { name: "Refund policy" })).toHaveAttribute(
      "href",
      "#refunds",
    );
  });

  it("names social links by network with decorative icons, and shows the health line", () => {
    render(<Footer {...footerFixture} />);

    const instagram = screen.getByRole("link", { name: "Instagram" });
    expect(instagram.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(footerFixture.healthLine)).toBeInTheDocument();
  });

  it("hides the EVOLVE watermark from screen readers", () => {
    render(<Footer {...footerFixture} />);

    expect(screen.getByText("Evolve", { selector: "p" })).toHaveAttribute("aria-hidden", "true");
  });
});
