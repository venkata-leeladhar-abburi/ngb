import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { navFixture } from "../NavBar/nav-fixture";
import { MobileHeader } from "./MobileHeader";

describe("MobileHeader", () => {
  it("shows the wordmark, language switch and a named menu button", () => {
    render(<MobileHeader {...navFixture} />);

    expect(screen.getByRole("link", { name: "NGB Evolve, home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens a modal menu with the links, closes with Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(<MobileHeader {...navFixture} />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    const menu = screen.getByRole("dialog", { name: "Menu" });
    expect(within(menu).getByRole("link", { name: "Programs" })).toBeInTheDocument();
    expect(within(menu).getByRole("link", { name: "Start my plan" })).toBeInTheDocument();
    expect(within(menu).getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("closes when a link is followed", async () => {
    const user = userEvent.setup();
    render(<MobileHeader {...navFixture} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Workouts" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
