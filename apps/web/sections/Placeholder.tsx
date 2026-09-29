import type { ReactNode } from "react";

interface PlaceholderProps {
  headline: string;
  sub: string;
  children?: ReactNode;
}

/**
 * Temporary page body until the real sections exist (Phase 5 replaces it with Hero, ProofStrip...).
 * Unstyled on purpose: no design values are allowed before the token package is built.
 */
export function Placeholder({ headline, sub, children }: PlaceholderProps) {
  return (
    <main id="main">
      <h1>{headline}</h1>
      <p>{sub}</p>
      {children}
    </main>
  );
}
