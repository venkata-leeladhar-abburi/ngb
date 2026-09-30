import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VideoCard } from "./VideoCard";

describe("VideoCard", () => {
  it("is one link named by title and length, with a decorative play button", () => {
    render(
      <VideoCard href="/workouts/chest-at-home" title="Chest at home" meta="12 min, Telugu" />,
    );

    const link = screen.getByRole("link", { name: "Chest at home / 12 min, Telugu" });
    expect(link.querySelector(".rounded-full")?.closest("[aria-hidden]")).not.toBeNull();
  });

  it("says a locked video is locked and where it lives", () => {
    render(
      <VideoCard
        href="/programs/mass-builder"
        title="Full chest plan"
        locked
        lockedLabel="Inside Mass Builder"
      />,
    );

    expect(
      screen.getByRole("link", { name: "Locked: Full chest plan Inside Mass Builder" }),
    ).toHaveAttribute("href", "/programs/mass-builder");
  });

  it("shows a labelled placeholder until a real thumbnail exists", () => {
    render(
      <VideoCard href="#" title="Chest at home" placeholderLabel="Thumbnail (video pending)" />,
    );

    expect(screen.getByText("Thumbnail (video pending)")).toBeInTheDocument();
    // Decorative inside the link: the card is named by its title, not the placeholder.
    expect(screen.getByRole("link")).toHaveAccessibleName("Chest at home");
  });
});
