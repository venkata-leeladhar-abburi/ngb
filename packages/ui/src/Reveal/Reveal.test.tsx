import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Reveal } from "./Reveal";

let trigger: ((entries: Partial<IntersectionObserverEntry>[]) => void) | undefined;
let options: IntersectionObserverInit | undefined;

beforeEach(() => {
  trigger = undefined;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
        init?: IntersectionObserverInit,
      ) {
        trigger = callback;
        options = init;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockMotion(reduced: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("reduce"),
  }));
}

function renderBelowFold() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: window.innerHeight + 100,
  } as DOMRect);
  return render(
    <Reveal effect="rise">
      <p>Featured program</p>
    </Reveal>,
  );
}

describe("Reveal", () => {
  it("never hides content that is already on screen", () => {
    mockMotion(false);
    render(
      <Reveal effect="rise">
        <p>Featured program</p>
      </Reveal>,
    );

    expect(screen.getByText("Featured program").parentElement).toHaveAttribute(
      "data-reveal",
      "idle",
    );
  });

  it("arms below the fold and shows once scrolled into view", () => {
    mockMotion(false);
    renderBelowFold();
    const wrapper = screen.getByText("Featured program").parentElement;

    expect(wrapper).toHaveAttribute("data-reveal", "armed");
    act(() => {
      trigger?.([{ isIntersecting: true }]);
    });
    expect(wrapper).toHaveAttribute("data-reveal", "shown");
  });

  it("reveals on any visible pixel, so content taller than the screen is never stuck hidden", () => {
    mockMotion(false);
    renderBelowFold();

    expect(options?.threshold).toBe(0);
  });

  it("does nothing with reduced motion", () => {
    mockMotion(true);
    renderBelowFold();

    expect(screen.getByText("Featured program").parentElement).toHaveAttribute(
      "data-reveal",
      "idle",
    );
  });
});
