import type { ReactNode } from "react";

interface QuoteCardProps {
  /** Max 3 lines, in the person's own words (home.md). Quotation marks are added. */
  quote: ReactNode;
  /** "Arjun, B.Tech student, Guntur". Real, consented people only. */
  by?: ReactNode;
  /** Language of the quote, e.g. "te" for Telugu or Tenglish written in Telugu script. */
  lang?: string;
  /** Layout only. */
  className?: string;
}

/**
 * Pull quote with the studio-red bar (screens A2 and A4).
 *
 * **Use for:** a real quote from Nawin or a member, with who said it.
 *
 * **Not for:** invented testimonials or placeholder quotes presented as real.
 */
export function QuoteCard({ quote, by, lang, className }: QuoteCardProps) {
  return (
    <figure className={`border-l-4 border-(--text-color-brand) pl-24 ${className ?? ""}`}>
      <blockquote lang={lang} className="text-lead text-primary">
        <p>“{quote}”</p>
      </blockquote>
      {by && <figcaption className="mt-8 text-muted">{by}</figcaption>}
    </figure>
  );
}
