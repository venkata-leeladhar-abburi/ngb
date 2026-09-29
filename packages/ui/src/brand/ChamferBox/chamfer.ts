/**
 * Corner-cut geometry (cut top-right and bottom-left, board 05).
 * The only place in the codebase that writes clip-path (ngb-design-system skill).
 */

import type { CSSProperties } from "react";

export type Cut = "button" | "tool-card" | "tag";

/** Moving a 45° cut edge by a distance d changes the cut size by d × (2 − √2). */
const DIAGONAL = 2 - Math.SQRT2;

export const cutSize = (cut: Cut): string => `var(--shape-chamfer-${cut})`;

/** A cut grown outward (positive distance) while keeping its edge parallel to the original. */
export const growCut = (cut: string, distance: string): string =>
  `calc(${cut} + ${distance} * ${DIAGONAL})`;

/** A cut shrunk inward by a distance (for a shape inset inside a border), edge kept parallel. */
export const shrinkCut = (cut: string, distance: string): string =>
  `calc(${cut} - ${distance} * ${DIAGONAL})`;

/** The six corners of a chamfered box, inset from the edges by `inset`. */
function corners(cut: string, inset = "0%"): string[] {
  const far = `calc(100% - ${inset})`;
  return [
    `${inset} ${inset}`,
    `calc(100% - ${inset} - ${cut}) ${inset}`,
    `${far} calc(${inset} + ${cut})`,
    `${far} ${far}`,
    `calc(${inset} + ${cut}) ${far}`,
    `${inset} calc(100% - ${inset} - ${cut})`,
  ];
}

/** A filled chamfered shape. */
export const chamfer = (cut: string): string => `polygon(${corners(cut).join(", ")})`;

/**
 * A chamfered ring `width` thick with a transparent middle, for borders and focus rings.
 * One even-odd polygon: the outer outline, then the inner outline (joined by a zero-area seam).
 */
export function chamferRing(cut: string, width: string): string {
  const outer = corners(cut);
  const inner = corners(`calc(${cut} - ${width} * ${DIAGONAL})`, width);
  return `polygon(evenodd, ${[...outer, outer[0], ...inner, inner[0]].join(", ")})`;
}

/**
 * Clips an element to the chamfer shape. For a component's inner track (segmented controls) so a
 * selected fill follows the cut corners. Outer shapes, borders and focus rings use ChamferBox.
 */
export const chamferClip = (cut: Cut): CSSProperties => ({ clipPath: chamfer(cutSize(cut)) });
