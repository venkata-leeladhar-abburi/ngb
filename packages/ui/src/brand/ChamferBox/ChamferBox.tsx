import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import { chamfer, chamferRing, cutSize, growCut, shrinkCut, type Cut } from "./chamfer";

type ChamferBoxProps<T extends ElementType> = {
  /** Element to render: "button", "a", a Next.js Link... Defaults to `div`. */
  as?: T;
  /** Which corner cut from the tokens. */
  cut?: Cut;
  /** Classes for the clipped fill layer: colour plus state variants such as `group-active/chamfer:...`. */
  fill?: string;
  /** Classes for a chamfered border layer (its colour). Omit for no border. */
  border?: string;
  /**
   * Hollow: the border is a ring with a see-through middle, for shapes with no solid fill (secondary
   * button). Otherwise the border is a solid shape under an inset fill, which looks the same and lets
   * contrast checkers (which ignore clip-path) see the real fill behind the text.
   */
  hollow?: boolean;
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
 * an optional chamfered border, a clipped fill, and a chamfered focus ring outside the box.
 * State variants for the layers use the `chamfer` group: `group-hover/chamfer:`, `group-active/chamfer:`.
 *
 * The fill and border layers stay hit-testable (no pointer-events: none) and never use negative z-index:
 * accessibility checkers work out a text's background from these layers. Clicks on them still reach the
 * element. Only the ring, which sits outside the box, ignores the pointer.
 *
 * **Use for:** building new components with the cut-corner shape.
 *
 * **Not for:** use in sections or pages (use the component built on it); cards (4 px radius).
 */
export function ChamferBox<T extends ElementType = "div">({
  as,
  cut = "button",
  fill,
  border,
  hollow = false,
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
      // outline-hidden: invisible normally, but a real system-colour outline in forced-colours mode, where
      // the background layers below are removed; that outline then draws the control's shape. Focus makes
      // it thicker and further out, so it is not mistaken for the resting outline.
      className={`group/chamfer relative isolate outline-hidden forced-colors:focus-visible:outline-4 forced-colors:focus-visible:outline-offset-4 [&>:not([data-chamfer])]:relative ${className ?? ""}`}
      {...props}
    >
      {focusRing !== "none" && (
        <span
          aria-hidden="true"
          data-chamfer="ring"
          className={`pointer-events-none absolute hidden group-focus-visible/chamfer:block ${ringColor} forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none`}
          style={{
            inset: `calc(${RING_OFFSET} * -1)`,
            clipPath: chamferRing(growCut(size, RING_OFFSET), "var(--focus-ring-width)"),
          }}
        />
      )}
      {border && (
        <span
          aria-hidden="true"
          data-chamfer="border"
          className={`absolute inset-0 ${border}`}
          style={{ clipPath: hollow ? chamferRing(size, borderWidth) : chamfer(size) }}
        />
      )}
      {fill && (
        <span
          aria-hidden="true"
          data-chamfer="fill"
          className={`absolute ${fill}`}
          style={
            border && !hollow
              ? { inset: borderWidth, clipPath: chamfer(shrinkCut(size, borderWidth)) }
              : { inset: 0, clipPath: chamfer(size) }
          }
        />
      )}
      {children}
    </Component>
  );
}
