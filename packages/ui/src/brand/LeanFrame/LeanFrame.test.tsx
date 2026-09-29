import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LeanFrame } from "./LeanFrame";

describe("LeanFrame", () => {
  it("leans the frame and counter-skews the content", () => {
    const { container } = render(
      <LeanFrame className="aspect-3/4">
        <img alt="Nawin in the red studio" src="/photo.jpg" />
      </LeanFrame>,
    );

    const frame = container.firstElementChild as HTMLElement;
    const content = frame.querySelector<HTMLElement>('[data-lean="content"]');
    expect(frame.style.transform).toBe("skewX(var(--shape-lean))");
    expect(content?.style.transform).toBe("skewX(calc(var(--shape-lean) * -1))");
    expect(content).toContainElement(container.querySelector("img"));
  });

  it("renders the element it is given", () => {
    const { container } = render(
      <LeanFrame as="figure">
        <figcaption>Caption</figcaption>
      </LeanFrame>,
    );

    expect(container.firstElementChild?.tagName).toBe("FIGURE");
  });
});
