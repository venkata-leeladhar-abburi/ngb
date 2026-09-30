import { UserIcon } from "@phosphor-icons/react/ssr";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LinkCard } from "./LinkCard";

describe("LinkCard", () => {
  it("is one link named by its question and destination", () => {
    render(
      <LinkCard
        href="/coaching"
        icon={UserIcon}
        title="Want a coach checking on you every week?"
        label="1:1 Coaching"
      />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/coaching");
    expect(link).toHaveAccessibleName("Want a coach checking on you every week? 1:1 Coaching");
  });
});
