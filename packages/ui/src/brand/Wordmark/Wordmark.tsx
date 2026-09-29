interface WordmarkProps {
  /** dark: bone NGB, red EVOLVE (on black). red: all bone (on studio red). bone: ground NGB, red EVOLVE (on bone). */
  tone?: "dark" | "red" | "bone";
  /** md for headers, lg for the mobile menu and footer. */
  size?: "md" | "lg";
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
 */
export function Wordmark({ tone = "dark", size = "md", className }: WordmarkProps) {
  const colours = TONES[tone];
  return (
    <span
      className={`inline-flex min-w-96 gap-8 font-display leading-display whitespace-nowrap uppercase italic ${size === "lg" ? "text-display" : "text-h2"} ${className ?? ""}`}
    >
      <span className={colours.ngb}>NGB</span>
      <span className={colours.evolve}>Evolve</span>
    </span>
  );
}
