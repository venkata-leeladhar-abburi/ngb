import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

type EmberSurfaceProps<T extends ElementType> = {
  as?: T;
  /**
   * card: the ember gradient (transformation cards, featured program, share cards). Content sits at the
   * bottom, on the dark zone (6.3:1); never place text over the bright middle.
   * glow: red light rising from the bottom (the final call). Use at most one glowing element per screen.
   */
  variant?: "card" | "glow";
  /** Layout and padding. */
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

/**
 * Ember surfaces from board 03. Only for the uses listed in the ngb-design-system skill.
 *
 * **Use for:** transformation cards, the featured program, share cards and the final-call glow.
 *
 * **Not for:** any other surface; text outside the dark lower zone.
 */
export function EmberSurface<T extends ElementType = "div">({
  as,
  variant = "card",
  className,
  children,
  ...props
}: EmberSurfaceProps<T>) {
  const Component: ElementType = as ?? "div";
  const surface =
    variant === "card"
      ? "flex flex-col justify-end overflow-hidden rounded-card"
      : "overflow-hidden bg-page";
  return (
    <Component
      className={`relative ${surface} ${className ?? ""}`}
      style={{
        backgroundImage: variant === "card" ? "var(--gradient-ember)" : "var(--gradient-glow)",
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
