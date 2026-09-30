interface WordmarkProps {
  /** dark: bone NGB, red EVOLVE (on black). red: all bone (on studio red). bone: ground NGB, red EVOLVE (on bone). */
  tone?: "dark" | "red" | "bone";
  /** sm for the phone header (fits 320 px; EVOLVE turns signal red for contrast), md for desktop headers, lg for the mobile menu and footer. */
  size?: "sm" | "md" | "lg";
  /** Layout only. */
  className?: string;
}

const TONES = {
  dark: { ngb: "text-primary", evolve: "text-brand" },
  red: { ngb: "text-primary", evolve: "text-primary" },
  bone: { ngb: "text-on-gold", evolve: "text-brand" },
} as const;

/**
 * The NGB EVOLVE wordmark in Rush Driver (board 01). Minimum width 96 px; keep clear space equal to
 * the height of the N. It is text, so wrap it in a link with a name ("NGB Evolve, home") where needed.
 *
 * **Use for:** the logo in the headers, the mobile menu and the footer.
 *
 * **Not for:** headings or poster words (Heading); anything that restyles or recolours it outside its tones.
 */
export function Wordmark({ tone = "dark", size = "md", className }: WordmarkProps) {
  const colours = TONES[tone];
  // Under 24 px studio red is below 4.5:1 on black, so the small size uses signal red (small red text).
  const evolve = size === "sm" && tone === "dark" ? "text-accent" : colours.evolve;
  return (
    <span
      className={`inline-flex gap-8 font-display leading-display whitespace-nowrap uppercase italic ${size === "lg" ? "text-display" : size === "sm" ? "text-h3" : "text-h2"} ${className ?? ""}`}
    >
      <span className={colours.ngb}>NGB</span>
      <span className={evolve}>Evolve</span>
    </span>
  );
}
