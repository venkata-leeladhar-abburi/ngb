import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

type LeanFrameProps<T extends ElementType> = {
  as?: T;
  /** Size the frame (aspect-* or h-*): it is a size container, so it does not grow with its content. */
  className?: string;
  /** Usually one `next/image` with `fill`, or an image with `size-full object-cover`. */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

/**
 * Photo frame leaning 8 degrees (board 05). The frame leans; its content is counter-skewed so photos
 * and text stay upright, and widened by tan(8°) × height so no corner is left empty.
 *
 * **Use for:** photos of Nawin and members, at 8 degrees.
 *
 * **Not for:** text-only cards, UI controls, or more than a few leaning frames in one view.
 */
export function LeanFrame<T extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: LeanFrameProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ transform: "skewX(var(--shape-lean))", containerType: "size" }}
      {...props}
    >
      <div
        data-lean="content"
        className="absolute inset-y-0"
        style={{
          insetInline: "calc(tan(var(--shape-lean)) * 50cqh)",
          transform: "skewX(calc(var(--shape-lean) * -1))",
        }}
      >
        {children}
      </div>
    </Component>
  );
}
