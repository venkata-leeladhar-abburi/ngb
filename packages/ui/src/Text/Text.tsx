import type { HTMLAttributes, ReactNode } from "react";

/** The text roles on board 04. */
export type TextVariant = "lead" | "body" | "label" | "data" | "readout";

const VARIANTS: Record<TextVariant, string> = {
  // GT America Standard: everything people read. Never below 16 px, line height 1.65.
  // No line-height class: lead follows the page (1.65, or 1.75 on Telugu pages).
  lead: "font-body text-lead",
  body: "font-body text-body",
  // GT America Extended Bold, uppercase and tracked: labels and eyebrows.
  label: "font-label text-label font-bold uppercase",
  // GT America Mono: numbers that line up (per-day prices, units).
  data: "font-data text-body",
  // GT America Mono at readout size: tool results ("2,480 kcal").
  readout: "font-data text-readout",
};

const TONES = {
  primary: "text-primary",
  muted: "text-muted",
  // Signal red: small red text (errors pair it with an icon).
  accent: "text-accent",
  // Good green: healthy results, always with an icon or words that say so.
  good: "text-good",
} as const;

type TextProps = {
  /** Element for the meaning: p (default), span, li, dd, strong... */
  as?: "p" | "span" | "div" | "li" | "dt" | "dd" | "strong" | "small" | "figcaption";
  variant?: TextVariant;
  tone?: keyof typeof TONES;
  /** Layout only (margin, max width such as max-w-measure). */
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

/**
 * Reading text, labels and numbers in the board 04 roles. Use it in sections instead of font classes.
 * On `lang="te"` it switches to the Telugu fonts and 1.75 line height (base.css).
 *
 * **Use for:** all reading text, labels and numbers in sections: lead, body, label, data, readout.
 *
 * **Not for:** headings (Heading); button labels (Button sets its own).
 */
export function Text({
  as: Tag = "p",
  variant = "body",
  tone = "primary",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag className={`${VARIANTS[variant]} ${TONES[tone]} ${className ?? ""}`} {...props}>
      {children}
    </Tag>
  );
}
