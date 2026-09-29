import type { ComponentPropsWithRef, ElementType } from "react";

type VisuallyHiddenProps<T extends ElementType> = {
  /** Element to render. Defaults to `span`. */
  as?: T;
  /** Show the content when it receives keyboard focus (skip links). */
  focusable?: boolean;
} & Omit<ComponentPropsWithRef<T>, "as">;

/**
 * Hides content visually but keeps it for screen readers.
 * Use for icon-only button labels and skip links. Never use it to hide text a sighted user needs.
 */
export function VisuallyHidden<T extends ElementType = "span">({
  as,
  focusable = false,
  className,
  ...props
}: VisuallyHiddenProps<T>) {
  const Component: ElementType = as ?? "span";
  const classes = [focusable ? "sr-only focus:not-sr-only" : "sr-only", className]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes} {...props} />;
}
