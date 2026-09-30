import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

interface IconProps {
  /** A Phosphor icon from "@phosphor-icons/react/ssr", e.g. `CaretRightIcon`. */
  icon: PhosphorIcon;
  /** Token size: 16, 20, 24 or 32 px (board 06). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Only for icons that carry meaning on their own. Omit for decoration next to text. */
  label?: string;
  /** Colour and layout. Icons are bone; only the flame may be signal red (text-accent). */
  className?: string;
}

const SIZES = {
  sm: "size-(--icon-sm)",
  md: "size-(--icon-md)",
  lg: "size-(--icon-lg)",
  xl: "size-(--icon-xl)",
} as const;

/**
 * Phosphor icon, regular weight (1.5 px stroke at 24 px), never inside a circle (board 06).
 * Decorative by default; give a label when the icon is the only thing that carries the meaning.
 *
 * **Use for:** Phosphor icons beside words, and in icon-only buttons with a label.
 *
 * **Not for:** icons in circles; icons as the only sign of status (add words).
 */
export function Icon({ icon: Glyph, size = "md", label, className }: IconProps) {
  return (
    <Glyph
      weight="regular"
      className={`shrink-0 ${SIZES[size]} ${className ?? ""}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
