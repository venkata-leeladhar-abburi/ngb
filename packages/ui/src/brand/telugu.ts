/**
 * Anek Telugu has no italic, so Telugu text that is italic in English leans with the 8 degree skew
 * instead (ngb-design-system skill, Typography). For block-level headings and card titles.
 */
export const TELUGU_LEAN =
  "[&:lang(te)]:not-italic [&:lang(te)]:origin-bottom-left [&:lang(te)]:skew-x-(--shape-lean)";
