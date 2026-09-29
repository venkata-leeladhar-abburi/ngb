import type { ReactNode } from "react";

/**
 * Layout for the Foundations pages. These pages document the tokens; every value they show is read
 * from @ngb/tokens, never typed by hand.
 */
export function FoundationPage({
  title,
  board,
  intro,
  children,
}: {
  title: string;
  board: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-page px-page py-64 text-primary">
      <div className="mx-auto max-w-content">
        <p className="font-data text-label text-muted">{board}</p>
        <h1 className="mt-8 font-heading text-h1 font-black uppercase italic">{title}</h1>
        <p className="mt-16 max-w-lead text-lead text-muted">{intro}</p>
        {children}
      </div>
    </main>
  );
}

export function FoundationSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-64 border-t border-subtle pt-32">
      <h2 className="font-label text-label font-bold text-muted uppercase">{title}</h2>
      <div className="mt-24">{children}</div>
    </section>
  );
}

/** Reads a resolved token by dotted path, e.g. `get(tokens, "color.bg.page")`. */
export function get(tree: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        typeof node === "object" && node !== null
          ? (node as Record<string, unknown>)[key]
          : undefined,
      tree,
    );
}

/** The Tailwind class that uses a colour variable, e.g. `--background-color-page` -> `bg-page`. */
export function colorClass(cssVar: string): string {
  const prefixes: [string, string][] = [
    ["--background-color-", "bg-"],
    ["--text-color-", "text-"],
    ["--border-color-", "border-"],
    ["--outline-color-", "outline-"],
  ];
  for (const [from, to] of prefixes) {
    if (cssVar.startsWith(from)) return `${to}${cssVar.slice(from.length)}`;
  }
  return `(${cssVar})`;
}

/** A wide table that scrolls sideways on phones. Focusable and labelled so keyboard users can scroll it. */
export function ScrollTable({ label, children }: { label: string; children: ReactNode }) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable (WCAG 2.1.1)
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto">
      {children}
    </div>
  );
}

/** WCAG level for a pair, derived from its computed ratio and what it is used for. */
export function contrastLevel(ratio: number, kind: "text" | "large" | "ui"): string {
  if (kind === "ui") return "UI borders (3:1)";
  if (kind === "large") return "Large text only (24 px+)";
  return ratio >= 7 ? "AAA" : "AA";
}

/** "150ms" -> 150; "16px" -> "16 px" for prose. */
export const ms = (value: string): number => Number.parseFloat(value);
export const pxText = (value: string): string => `${Number.parseFloat(value)} px`;
