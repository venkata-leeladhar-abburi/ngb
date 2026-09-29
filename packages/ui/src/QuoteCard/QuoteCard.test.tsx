import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QuoteCard } from "./QuoteCard";

describe("QuoteCard", () => {
  it("is a figure with the quote and who said it", () => {
    render(<QuoteCard quote="If I could do it, you can too." by="Nawin" />);

    const figure = screen.getByRole("figure");
    expect(figure).toHaveTextContent("“If I could do it, you can too.”");
    expect(screen.getByText("Nawin").tagName).toBe("FIGCAPTION");
  });

  it("marks the language of a quote in another language", () => {
    const { container } = render(<QuoteCard quote="నేను జీరో నుంచి చేశాను." lang="te" />);

    expect(container.querySelector("blockquote")).toHaveAttribute("lang", "te");
  });
});
