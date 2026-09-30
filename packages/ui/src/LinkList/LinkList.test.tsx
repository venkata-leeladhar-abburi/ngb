import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LinkList } from "./LinkList";

describe("LinkList", () => {
  it("is a named list with one link per row", () => {
    render(
      <LinkList
        label="Muscle groups"
        items={[
          { href: "/workouts/chest", label: "Chest", meta: "3 free" },
          { href: "/workouts/back", label: "Back", meta: "3 free" },
        ]}
      />,
    );

    const list = screen.getByRole("list", { name: "Muscle groups" });
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/workouts/chest");
    expect(links[0]).toHaveAccessibleName("Chest 3 free");
  });
});
