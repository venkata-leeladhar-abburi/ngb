import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavBar } from "./NavBar";
import { navFixture } from "./nav-fixture";

describe("NavBar", () => {
  it("has a named home link, the five main links, the language switch and the buy link", () => {
    render(<NavBar {...navFixture} />);

    expect(screen.getByRole("link", { name: "NGB Evolve, home" })).toHaveAttribute("href", "#home");
    const main = screen.getByRole("navigation", { name: "Main" });
    expect(
      within(main)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Programs", "Free tools", "Workouts", "Transformations", "About"]);
    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start my plan" })).toHaveAttribute("href", "#start");
  });

  it("marks only the current page", () => {
    const links = navFixture.links.map((link) => ({ ...link, current: link.href === "#programs" }));
    render(<NavBar {...navFixture} links={links} />);

    expect(screen.getByRole("link", { name: "Programs" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });
});
