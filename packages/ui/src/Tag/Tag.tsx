import type { ComponentPropsWithRef, ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";

type TagProps = {
  /** Layout only. */
  className?: string;
  /** Short, sentence case; CSS uppercases it. */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<"span">, "children" | "className">;

/**
 * The ember-gold tag with an 8 px cut (boards 07 and 08). Gold is reserved for the one
 * "Most popular" tag on a screen (ngb-design-system skill), so there is a single variant.
 */
export function Tag({ className, children, ...props }: TagProps) {
  return (
    <ChamferBox
      as="span"
      cut="tag"
      focusRing="none"
      fill="bg-popular"
      className={`inline-flex items-center px-12 py-4 font-label text-label font-bold text-on-gold uppercase ${className ?? ""}`}
      {...props}
    >
      <span>{children}</span>
    </ChamferBox>
  );
}
