import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { chamfer, chamferRing, growCut } from "./chamfer";
import { ChamferBox } from "./ChamferBox";

describe("chamfer geometry", () => {
  it("cuts the top-right and bottom-left corners", () => {
    expect(chamfer("var(--cut)")).toBe(
      "polygon(0% 0%, calc(100% - 0% - var(--cut)) 0%, calc(100% - 0%) calc(0% + var(--cut)), calc(100% - 0%) calc(100% - 0%), calc(0% + var(--cut)) calc(100% - 0%), 0% calc(100% - 0% - var(--cut)))",
    );
  });

  it("draws a ring as one even-odd polygon with a parallel inner cut", () => {
    const ring = chamferRing("var(--cut)", "var(--w)");
    expect(ring.startsWith("polygon(evenodd, 0% 0%,")).toBe(true);
    expect(ring).toContain(`calc(var(--cut) - var(--w) * ${2 - Math.SQRT2})`);
    expect(ring.match(/var\(--w\) var\(--w\)/g)).toHaveLength(2);
  });

  it("grows a cut outward along its 45 degree edge", () => {
    expect(growCut("var(--cut)", "var(--d)")).toBe(
      `calc(var(--cut) + var(--d) * ${2 - Math.SQRT2})`,
    );
  });
});

describe("ChamferBox", () => {
  it("renders the requested element with content above hidden layers", () => {
    render(
      <ChamferBox as="button" type="button" fill="bg-action">
        Start my plan
      </ChamferBox>,
    );

    const button = screen.getByRole("button", { name: "Start my plan" });
    const layers = button.querySelectorAll("[data-chamfer]");
    expect(layers).toHaveLength(2);
    layers.forEach((layer) => {
      expect(layer).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("adds a border layer only when asked, and no ring for non-interactive boxes", () => {
    const { container } = render(
      <ChamferBox cut="tag" border="bg-(--text-color-primary)" focusRing="none">
        Pro
      </ChamferBox>,
    );

    expect(container.querySelector('[data-chamfer="border"]')).not.toBeNull();
    expect(container.querySelector('[data-chamfer="ring"]')).toBeNull();
    expect(container.querySelector('[data-chamfer="fill"]')).toBeNull();
  });

  it("keeps the fill hit-testable so contrast checkers measure the real background", () => {
    const { container } = render(<ChamferBox fill="bg-action">Label</ChamferBox>);

    expect(container.querySelector('[data-chamfer="fill"]')).not.toHaveClass("pointer-events-none");
    expect(container.querySelector('[data-chamfer="ring"]')).toHaveClass("pointer-events-none");
  });

  it("uses the bone ring on studio red grounds", () => {
    const { container } = render(<ChamferBox focusRing="onRed">On red</ChamferBox>);

    expect(container.querySelector('[data-chamfer="ring"]')).toHaveClass(
      "bg-(--focus-ring-color-on-red)",
    );
  });
});
