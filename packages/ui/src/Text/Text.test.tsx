import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text } from "./Text";

describe("Text", () => {
  it("renders a paragraph in the body role by default", () => {
    render(<Text>Real food. Real plan.</Text>);

    const text = screen.getByText("Real food. Real plan.");
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("font-body", "text-body", "text-primary");
  });

  it("renders the element and role asked for", () => {
    render(
      <Text as="span" variant="readout" tone="good">
        2,480 kcal
      </Text>,
    );

    const text = screen.getByText("2,480 kcal");
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveClass("font-data", "text-readout", "text-good");
  });
});
