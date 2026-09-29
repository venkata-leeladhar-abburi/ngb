import { describe, expect, it } from "vitest";

import { cubicBezier, fluid, fontFamily, gradient, px, rem, shadow } from "./css.ts";

/** Evaluates a fluid clamp() at a viewport width, in px. */
function sizeAt(css: string, viewport: number): number {
  const match = /clamp\(([\d.]+)rem, (-?[\d.]+)rem \+ ([\d.]+)vw, ([\d.]+)rem\)/.exec(css);
  if (!match) throw new Error(`Not a fluid clamp: ${css}`);
  const [min, intercept, vw, max] = match.slice(1).map(Number) as [number, number, number, number];
  return Math.min(Math.max(intercept * 16 + (vw * viewport) / 100, min * 16), max * 16);
}

describe("css formatting", () => {
  it("converts px to rem", () => {
    expect(px("52px")).toBe(52);
    expect(rem(52)).toBe("3.25rem");
    expect(() => px("3rem")).toThrow("px dimension");
  });

  it("builds fluid sizes that hit both board sizes exactly", () => {
    const h1 = fluid(36, 56, 360, 1440);
    expect(sizeAt(h1, 360)).toBeCloseTo(36, 1);
    expect(sizeAt(h1, 1440)).toBeCloseTo(56, 1);
    expect(sizeAt(h1, 320)).toBeCloseTo(36, 1);
    expect(sizeAt(h1, 1920)).toBeCloseTo(56, 1);
    expect(fluid(16, 16, 360, 1440)).toBe("1rem");
  });

  it("quotes family names but not generic families", () => {
    expect(fontFamily(["GT America Mono", "ui-monospace", "monospace"])).toBe(
      '"GT America Mono", ui-monospace, monospace',
    );
  });

  it("formats shadows, gradients and easing", () => {
    expect(
      shadow([{ color: "#000", offsetX: "0px", offsetY: "2px", blur: "4px", spread: "0px" }]),
    ).toBe("0px 2px 4px 0px #000");
    expect(
      gradient(
        [
          { color: "#fff", position: 0 },
          { color: "#000", position: 0.5 },
        ],
        { kind: "radial", position: "36% 24%" },
      ),
    ).toBe("radial-gradient(at 36% 24%, #fff 0%, #000 50%)");
    expect(cubicBezier([0.16, 1, 0.3, 1])).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
  });
});
