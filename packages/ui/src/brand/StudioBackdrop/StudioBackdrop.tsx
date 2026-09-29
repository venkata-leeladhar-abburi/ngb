import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

type StudioBackdropProps<T extends ElementType> = {
  /** Usually "section". */
  as?: T;
  /** red: the seamless red studio (hero, programs); night: the black ground. */
  variant?: "red" | "night";
  /** Layout and padding. */
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

/**
 * Full-bleed section background (board 03 Surfaces). The red studio is brightest at the centre and
 * darkens towards the edges; bone text on it is at least 4.7:1. The night variant's fine grain is a
 * photo texture that arrives with the imagery (Phase 5).
 */
export function StudioBackdrop<T extends ElementType = "div">({
  as,
  variant = "red",
  className,
  children,
  ...props
}: StudioBackdropProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={`relative ${variant === "red" ? "bg-brand" : "bg-page"} text-primary ${className ?? ""}`}
      style={variant === "red" ? { backgroundImage: "var(--gradient-studio)" } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
