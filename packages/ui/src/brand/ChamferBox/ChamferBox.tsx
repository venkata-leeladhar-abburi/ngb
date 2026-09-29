import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import { chamfer, chamferRing, cutSize, growCut, type Cut } from "./chamfer";

type ChamferBoxProps<T extends ElementType> = {
  /** Element to render: "button", "a", a Next.js Link... Defaults to `div`. */
  as?: T;
  /** Which corner cut from the tokens. */
  cut?: Cut;
  /** Classes for the clipped fill layer: colour plus state variants such as `group-active/chamfer:...`. */
  fill?: string;
  /** Classes for a chamfered border layer (its colour). Omit for no border. */
  border?: string;
  /** Border thickness as a CSS length (a token variable). */
  borderWidth?: string;
  /** Keyboard focus ring: signal red, bone for studio-red grounds, or none for non-interactive boxes. */
  focusRing?: "default" | "onRed" | "none";
  /** Layout and text classes for the element itself (never a background: use `fill`). */
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

const RING_OFFSET = "(var(--focus-ring-gap) + var(--focus-ring-width))";

/**
 * A box with NGB's cut corners. Shadows and focus rings cannot be drawn on a clip-path element,
 * so the element stays unclipped and the shape is drawn by layers behind the content (the layers come
 * first in the DOM and every other direct child is positioned, so content paints on top without z-index):
 * a clipped fill, an optional chamfered border, and a chamfered focus ring outside the box.
 * State variants for the layers use the `chamfer` group: `group-hover/chamfer:`, `group-active/chamfer:`.
 *
 * The fill and border layers stay hit-testable (no pointer-events: none): accessibility checkers find a
 * text's background by hit-testing and would otherwise measure contrast against the wrong colour. Clicks on
 * them still reach the element. Only the ring, which sits outside the box, ignores the pointer.
 *
 * The fill and border layers must stay hit-testable (no pointer-events: none): accessibility checkers
 * find a text's background by hit-testing, and would otherwise measure contrast against the wrong colour.
 * Clicks on them still reach the element. Only the ring, which sits outside the box, ignores the pointer.
 */
export function ChamferBox<T extends ElementType = "div">({
  as,
  cut = "button",
  fill,
  border,
  borderWidth = "var(--focus-ring-width)",
  focusRing = "default",
  className,
  children,
  ...props
}: ChamferBoxProps<T>) {
  const Component: ElementType = as ?? "div";
  const size = cutSize(cut);
  const ringColor =
    focusRing === "onRed" ? "bg-(--focus-ring-color-on-red)" : "bg-(--focus-ring-color)";

  return (
    <Component
      className={`group/chamfer relative isolate outline-none forced-colors:outline forced-colors:focus-visible:outline-2 [&>:not([data-chamfer])]:relative ${className ?? ""}`}
      {...props}
    >
      {focusRing !== "none" && (
        <span
          aria-hidden="true"
          data-chamfer="ring"
          className={`pointer-events-none absolute hidden group-focus-visible/chamfer:block ${ringColor}`}
          style={{
            inset: `calc(${RING_OFFSET} * -1)`,
            clipPath: chamferRing(growCut(size, RING_OFFSET), "var(--focus-ring-width)"),
          }}
        />
      )}
      {fill && (
        <span
          aria-hidden="true"
          data-chamfer="fill"
          className={`absolute inset-0 ${fill}`}
          style={{ clipPath: chamfer(size) }}
        />
      )}
      {border && (
        <span
          aria-hidden="true"
          data-chamfer="border"
          className={`absolute inset-0 ${border}`}
          style={{ clipPath: chamferRing(size, borderWidth) }}
        />
      )}
      {children}
    </Component>
  );
}
