interface PosterWordProps {
  /** One English word in sentence case ("Evolve"); CSS uppercases it. Rush Driver has no Telugu glyphs. */
  children: string;
  /** mega: the hero and footer word (96 to 200 px). hero: a smaller poster word (64 to 120 px). */
  size?: "mega" | "hero";
  /**
   * ghost: the gold-to-orange ghost gradient at 70%, behind Nawin on the red studio (A1; the only
   * gradient text, token gradient.ghost). watermark: 10% bone, the footer word (A7).
   */
  tone?: "ghost" | "watermark";
  /** Slides in once on load (hero only). Reduced motion: shown in place. */
  animate?: boolean;
  /** Layout only: position it (absolute, inset...). The parent clips it with overflow-hidden. */
  className?: string;
}

/**
 * A giant decorative word in Rush Driver (board 04 mega, screens A1 and A7). It is art: hidden from
 * screen readers, ignores the pointer, never wraps, and may be wider than a phone. The parent section
 * must clip it (`overflow-hidden`) so it never causes sideways scroll. To centre a word wider than its
 * box, put it in a `flex justify-center` wrapper (it then overflows both sides evenly); leave room above
 * it for the glyphs' overshoot (about `top-24`).
 *
 * **Use for:** the EVOLVE behind Nawin in the hero, and the footer watermark.
 *
 * **Not for:** any word people need to read (Heading); more than one per screen.
 */
export function PosterWord({
  children,
  size = "mega",
  tone = "ghost",
  animate = false,
  className,
}: PosterWordProps) {
  return (
    <p
      aria-hidden="true"
      // An English brand word: keeps Rush Driver on Telugu pages too (base.css [lang|="en"]).
      lang="en"
      className={`pointer-events-none font-display leading-display whitespace-nowrap uppercase italic select-none ${size === "mega" ? "text-mega" : "text-hero"} ${tone === "watermark" ? "text-primary opacity-10" : "bg-(image:--gradient-ghost) bg-clip-text text-transparent opacity-70"} ${animate ? "[animation:ngb-poster-in_var(--motion-hero)_var(--ease-out)_both] motion-reduce:[animation:none]" : ""} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
