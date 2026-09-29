/**
 * Colour pairs approved on board 02, with the ratio printed on the board.
 * The build computes the real ratio; tests fail if a pair drops below its minimum
 * or no longer matches the board.
 */
export interface ContrastPair {
  foreground: string;
  background: string;
  /** WCAG minimum: 4.5 for text, 3 for large text (24 px+) and UI edges. */
  minimum: 4.5 | 3;
  /** Ratio printed on board 02. */
  board: number;
  use: string;
}

export const approvedPairs: readonly ContrastPair[] = [
  {
    foreground: "color.text.primary",
    background: "color.bg.page",
    minimum: 4.5,
    board: 15.7,
    use: "Main text",
  },
  {
    foreground: "color.text.muted",
    background: "color.bg.card",
    minimum: 4.5,
    board: 6.6,
    use: "Secondary text on cards",
  },
  {
    foreground: "color.text.accent",
    background: "color.bg.page",
    minimum: 4.5,
    board: 5.6,
    use: "Small red text, links, prices, focus ring",
  },
  {
    foreground: "color.text.primary",
    background: "color.bg.brand",
    minimum: 4.5,
    board: 4.7,
    use: "Text on studio red",
  },
  {
    foreground: "color.text.on-gold",
    background: "color.tag.popular",
    minimum: 4.5,
    board: 11.2,
    use: "Most popular tag",
  },
  {
    foreground: "color.text.brand",
    background: "color.bg.page",
    minimum: 3,
    board: 3.3,
    use: "Studio red text, 24 px and larger only",
  },
  {
    foreground: "color.border.strong",
    background: "color.bg.card",
    minimum: 3,
    board: 3.5,
    use: "Input borders and UI edges",
  },
  {
    foreground: "color.text.primary",
    background: "primitive.ember.stop-74",
    minimum: 4.5,
    board: 6.3,
    use: "Text on the ember dark zone (74% stop and darker; board 03)",
  },
];

/** Pairs the boards forbid, with the minimum each one fails. Tests confirm they really fail. */
export interface ForbiddenPair extends Omit<ContrastPair, "minimum"> {
  /** The WCAG minimum this pair does not reach for its use. */
  failsBelow: 4.5 | 3;
}

export const forbiddenPairs: readonly ForbiddenPair[] = [
  {
    foreground: "color.text.muted",
    background: "color.bg.brand",
    board: 2.2,
    failsBelow: 3,
    use: "Muted text on studio red (board 02)",
  },
  {
    foreground: "color.text.primary",
    background: "primitive.ember.stop-52",
    board: 3.6,
    failsBelow: 4.5,
    use: "Text over the bright middle of the ember gradient (board 03)",
  },
];
