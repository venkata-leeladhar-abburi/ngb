import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhotoPlaceholder } from "./PhotoPlaceholder";

const label = "Photo: Nawin, hero pose (shoot pending)";

describe("PhotoPlaceholder", () => {
  it("stands in for the photo as an image named by its label", () => {
    render(<PhotoPlaceholder label={label} />);

    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
    expect(screen.getByText(label)).toBeVisible();
  });

  it("is hidden from screen readers when decorative", () => {
    render(<PhotoPlaceholder decorative label={label} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
