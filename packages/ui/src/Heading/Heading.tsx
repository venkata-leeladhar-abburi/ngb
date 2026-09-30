import type { ComponentPropsWithRef, ReactNode } from "react";

import { TELUGU_LEAN } from "../brand/telugu";

/** The heading roles on board 04. Mega is not one: at that size words are decorative art (aria-hidden). */
export type HeadingVariant = "hero" | "display" | "h1" | "h2" | "h3";

// h2, h3: no line-height class. Board 04 defines none, so they follow the text around them (1.65, or
// 1.75 on Telugu pages); leading-heading is measured for the compressed and display faces only.
const VARIANTS: Record<HeadingVariant, string> = {
  // Rush Driver Italic: poster words and big numbers, capitals, five words at most.
  hero: `font-display text-hero uppercase italic ${TELUGU_LEAN}`,
  display: `font-display text-display uppercase italic ${TELUGU_LEAN}`,
  // GT America Compressed Black Italic.
  h1: `font-heading text-h1 font-black uppercase italic ${TELUGU_LEAN}`,
  // GT America Extended Bold ("SHRED 12" on board 04).
  h2: "font-label text-h2 font-bold uppercase",
  // GT America Standard Bold ("Calorie calculator").
  h3: "font-body text-h3 font-bold",
};

type HeadingProps = {
  /** Level in the document outline; choose it for the outline, then pick the look with `variant`. */
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant: HeadingVariant;
  /**
   * Studio red for the text, on the black page or carbon ground only: 3.3:1 there passes for 24 px+ text, but it
   * drops below 3:1 on cards (2.96:1) and disappears on red. Ignored on h3 (would fail 4.5:1). At most one red heading in view
   * (board 04 "FREE TOOLS").
   */
  tone?: "primary" | "brand";
  /** Layout only (margin, grid placement, max width). */
  className?: string;
  /** Sentence case; CSS uppercases where the role needs it. */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<"h2">, "children" | "className">;

/**
 * A heading in one of the board 04 roles. The level (`as`) and the look (`variant`) are separate, so the
 * outline stays logical whatever size a design asks for. Section titles with the red slash use
 * SectionTitle instead. On `lang="te"` the hero, display, h1 and h2 roles switch to Anek Telugu (leaning
 * by skew, as it has no italic) and h3 to Noto Sans Telugu (base.css).
 *
 * **Use for:** headings only, including poster headlines (hero, display) of five words or fewer.
 *
 * **Not for:** section titles with the red slash (SectionTitle); decorative giant words at mega size (aria-hidden art in the section); big numbers (StatStrip, ResultCard) and prices (ProgramCard); `tone="brand"` on cards or red; body text (Text).
 */
export function Heading({
  as: Tag,
  variant,
  tone = "primary",
  className,
  children,
  ...props
}: HeadingProps) {
  const colour = tone === "brand" && variant !== "h3" ? "text-brand" : "text-primary";
  return (
    <Tag
      className={`${VARIANTS[variant]} min-w-0 break-words ${colour} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
