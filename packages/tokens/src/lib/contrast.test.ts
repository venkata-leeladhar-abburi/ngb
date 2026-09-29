import { describe, expect, it } from "vitest";

import { approvedPairs, forbiddenPairs } from "../contrast-pairs.ts";
import { contrastRatio, luminance } from "./contrast.ts";
import { getToken, loadTokens, resolve } from "./tokens.ts";

const tree = loadTokens(new URL("../tokens.json", import.meta.url));
const hex = (path: string) => resolve(tree, getToken(tree, path).$value) as string;

describe("contrast maths", () => {
  it("matches the WCAG reference values", () => {
    expect(luminance("#FFFFFF")).toBe(1);
    expect(luminance("#000000")).toBe(0);
    expect(contrastRatio("#FFFFFF", "#000000")).toBe(21);
    expect(contrastRatio("#000000", "#FFFFFF")).toBe(21);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2);
  });

  it("rejects colours with transparency", () => {
    expect(() => luminance("#00000080")).toThrow("opaque");
  });
});

describe("board 02 pairs", () => {
  it.each(approvedPairs)(
    "$use: $foreground on $background meets $minimum:1 and matches the board ($board:1)",
    ({ foreground, background, minimum, board }) => {
      const ratio = contrastRatio(hex(foreground), hex(background));
      expect(ratio).toBeGreaterThanOrEqual(minimum);
      expect(ratio).toBeCloseTo(board, 0);
      expect(Math.abs(ratio - board)).toBeLessThanOrEqual(0.1);
    },
  );

  it.each(forbiddenPairs)(
    "$use stays forbidden (below 3:1)",
    ({ foreground, background, board }) => {
      const ratio = contrastRatio(hex(foreground), hex(background));
      expect(ratio).toBeLessThan(3);
      expect(Math.abs(ratio - board)).toBeLessThanOrEqual(0.1);
    },
  );
});
