interface PosterWordProps {
  /** One English word in sentence case ("Evolve"); CSS uppercases it. Rush Driver has no Telugu glyphs. */
  children: string;
  /** mega: the hero and footer word (96 to 200 px). hero: a smaller poster word (64 to 120 px). */
  size?: "mega" | "hero";
  /** solid: bone, behind the subject on the red studio (A1). ghost: 10% bone, the footer watermark (A7). */
  tone?: "solid" | "ghost";
  /** Slides in once on load (hero only). Reduced motion: shown in place. */
  animate?: boolean;
  /** Layout only: position it (absolute, inset...). The parent clips it with overflow-hidden. */
  className?: string;
}

/**
 * A giant decorative word in Rush Driver (board 04 mega, screens A1 and A7). It is art: hidden from
 * screen readers, ignores the pointer, never wraps, and may be wider than a phone. The parent section
 * must clip it (`overflow-hidden`) so it never causes sideways scroll.
 *
 * **Use for:** the EVOLVE behind Nawin in the hero, and the footer watermark.
 *
 * **Not for:** any word people need to read (Heading); more than one per screen.
 */
export function PosterWord({
  children,
  size = "mega",
  tone = "solid",
  animate = false,
  className,
}: PosterWordProps) {
  return (
    <p
      aria-hidden="true"
      className={`pointer-events-none font-display leading-display whitespace-nowrap uppercase italic select-none ${size === "mega" ? "text-mega" : "text-hero"} ${tone === "ghost" ? "text-primary opacity-10" : "text-primary"} ${animate ? "[animation:ngb-poster-in_var(--motion-hero)_var(--ease-out)_both] motion-reduce:[animation:none]" : ""} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
