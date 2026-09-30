import type { ComponentPropsWithRef, ReactNode } from "react";

type SectionTitleProps = {
  /** Heading level for the document outline. Sections usually use h2; the page's first section may use h1. */
  as?: "h1" | "h2" | "h3";
  /** The three red speed lines before the slash (board 08; used on screen A5). */
  speedLines?: boolean;
  /** Layout only (margin, grid placement). */
  className?: string;
  /** Sentence case; CSS uppercases it. */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<"h2">, "children" | "className">;

/** Three tapered strokes, thick end towards the slash. Decorative. */
function SpeedLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 60 24"
      className="shrink-0"
      style={{ width: "1.8em", height: "0.55em", fill: "var(--background-color-brand)" }}
    >
      <polygon points="10,3 58,1 58,6" />
      <polygon points="0,12 60,9.5 60,14.5" />
      <polygon points="16,21 56,18 56,23" />
    </svg>
  );
}

/**
 * Section title (board 08): optional speed lines, the red slash, then the title in
 * GT America Compressed Black Italic, uppercase. The heading's accessible name is the title only.
 *
 * **Use for:** the title of each page section, with the red slash.
 *
 * **Not for:** headings inside cards or forms (Heading).
 */
export function SectionTitle({
  as = "h2",
  speedLines = false,
  className,
  children,
  ...props
}: SectionTitleProps) {
  const Heading = as;
  return (
    <Heading
      className={`flex items-center gap-16 font-heading text-h1 font-black text-primary uppercase italic [&:lang(te)]:skew-x-(--shape-lean) [&:lang(te)]:not-italic ${className ?? ""}`}
      {...props}
    >
      {speedLines && <SpeedLines />}
      <span
        aria-hidden="true"
        data-slash=""
        className="shrink-0"
        style={{
          width: "0.22em",
          height: "0.85em",
          background: "var(--background-color-brand)",
          transform: "skewX(var(--shape-lean))",
        }}
      />
      {/* Anek Telugu has no italic: Telugu titles lean by skew (the text only, so the slash keeps its angle). */}
      <span className="[&:lang(te)]:skew-x-(--shape-lean) [&:lang(te)]:not-italic">{children}</span>
    </Heading>
  );
}
