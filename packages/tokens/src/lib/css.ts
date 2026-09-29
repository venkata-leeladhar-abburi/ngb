/** Formatting of resolved token values as CSS. */

const ROOT_FONT_SIZE = 16;
const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
]);

export const round = (value: number, digits = 4): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

/** "16px" -> 16. Throws for anything that is not a px dimension. */
export function px(value: unknown): number {
  if (typeof value !== "string" || !/^-?\d+(\.\d+)?px$/.test(value)) {
    throw new Error(`Expected a px dimension, got ${JSON.stringify(value)}`);
  }
  return Number.parseFloat(value);
}

/** px -> rem, so sizes follow the user's font-size setting (WCAG 1.4.4). */
export const rem = (pixels: number): string => `${round(pixels / ROOT_FONT_SIZE)}rem`;

/**
 * A size that grows linearly from `min` at the `from` viewport to `max` at the `to` viewport,
 * and stays fixed outside that range.
 */
export function fluid(min: number, max: number, from: number, to: number): string {
  if (min === max) return rem(min);
  const slope = (max - min) / (to - from);
  const intercept = min - slope * from;
  return `clamp(${rem(min)}, ${rem(intercept)} + ${round(slope * 100)}vw, ${rem(max)})`;
}

/**
 * A font stack. With `cssVariable`, the first family is wrapped as `var(--x, "Family")` so a font
 * loader (next/font) can supply its optimised family, and anything else falls back to the name.
 */
export function fontFamily(value: unknown, cssVariable?: string): string {
  if (!Array.isArray(value)) throw new Error(`Expected a font family list, got ${String(value)}`);
  return value
    .map((name: unknown, index) => {
      if (typeof name !== "string") throw new Error("Font family names must be strings");
      const css = GENERIC_FAMILIES.has(name) ? name : `"${name}"`;
      return index === 0 && cssVariable ? `var(${cssVariable}, ${css})` : css;
    })
    .join(", ");
}

interface ShadowLayer {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
}

export function shadow(value: unknown): string {
  const layers = (Array.isArray(value) ? value : [value]) as ShadowLayer[];
  return layers
    .map(({ offsetX, offsetY, blur, spread, color }) =>
      [offsetX, offsetY, blur, spread, color].join(" "),
    )
    .join(", ");
}

interface GradientStop {
  color: string;
  position: number;
}

export interface GradientShape {
  kind: "radial" | "linear";
  position?: string;
  direction?: string;
}

export function gradient(value: unknown, shape: GradientShape): string {
  const stops = (value as GradientStop[])
    .map(({ color, position }) => `${color} ${round(position * 100, 2)}%`)
    .join(", ");
  if (shape.kind === "radial") {
    return `radial-gradient(${shape.position ? `at ${shape.position}, ` : ""}${stops})`;
  }
  return `linear-gradient(${shape.direction ? `${shape.direction}, ` : ""}${stops})`;
}

export function cubicBezier(value: unknown): string {
  if (!Array.isArray(value) || value.length !== 4) throw new Error("cubicBezier needs 4 numbers");
  return `cubic-bezier(${value.join(", ")})`;
}
