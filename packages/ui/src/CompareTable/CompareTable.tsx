import { CheckCircleIcon, MinusIcon } from "@phosphor-icons/react/ssr";
import { useId, type ElementType, type ReactNode } from "react";

import { Button } from "../Button";
import { Icon } from "../Icon";

export interface CompareColumn {
  /** Program name, e.g. "Shred 12". Also names its button for screen readers. */
  name: string;
  /** The one recommended program: red top edge and oxblood tint down the column. */
  featured?: boolean;
  /** The buy link under the column: "Start my plan". */
  cta: { href: string; label: string };
}

export interface CompareRow {
  /** Row header: "Days a week". */
  label: ReactNode;
  /** One cell per column, in column order. `true` and `false` draw an icon with the yes or no word. */
  cells: readonly ReactNode[];
  /** Words, not numbers ("Home or gym"): set in the reading face instead of mono. */
  words?: boolean;
}

interface CompareTableProps {
  /** Names the table for screen readers: "Compare the plans". Not shown; the section title shows it. */
  caption: string;
  columns: readonly CompareColumn[];
  rows: readonly CompareRow[];
  /** Words read for `true` and `false` cells (pass Telugu on /te pages). */
  yesLabel?: string;
  noLabel?: string;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

const CELL = "border-t border-subtle p-8 md:p-16";
const COLUMN = "border-l border-subtle";
/** The first column stays put, above the programs that scroll under it on phones. */
const PINNED = "sticky left-0 z-(--layer-raised) bg-card";

/**
 * Comparison table (screen B1): programs across, facts down, a buy link under each column. A real
 * table, so screen readers announce the program and the fact with every value. On phones it scrolls
 * sideways inside its own focusable region (arrow keys scroll it) with the fact names pinned to the
 * left (scroll padding keeps a focused link clear of them); the page itself never does.
 * Every button is secondary: the featured column is marked by its red edge, not a second glow.
 *
 * **Use for:** comparing the programs fact by fact on the programs page.
 *
 * **Not for:** layout (use a grid); one program's details (ProgramCard); tool results (ResultCard).
 */
export function CompareTable({
  caption,
  columns,
  rows,
  yesLabel = "Yes",
  noLabel = "No",
  linkAs,
  className,
}: CompareTableProps) {
  const captionId = useId();
  const tint = (column: CompareColumn) => (column.featured ? "bg-band" : "");

  return (
    <div
      role="region"
      aria-labelledby={captionId}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable (WCAG 2.1.1)
      tabIndex={0}
      className={`scroll-pl-128 overflow-x-auto rounded-card border border-subtle bg-card text-primary ${className ?? ""}`}
    >
      <table className="w-full min-w-max border-collapse">
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr>
            <td className={PINNED} />
            {columns.map((column) => (
              <th
                key={column.name}
                scope="col"
                className={`relative p-8 font-label text-label font-bold uppercase md:p-16 ${COLUMN} ${tint(column)}`}
              >
                {column.featured && (
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-4 bg-action" />
                )}
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <th
                scope="row"
                className={`${CELL} ${PINNED} text-left font-body text-body font-regular`}
              >
                {/* A fixed, narrow label on phones (it wraps), so a whole program fits beside it. */}
                <span className="block w-96 md:w-auto">{row.label}</span>
              </th>
              {columns.map((column, cell) => {
                const value = row.cells[cell];
                return (
                  <td
                    key={column.name}
                    className={`${CELL} ${COLUMN} text-center text-body ${row.words ? "font-body" : "font-data"} ${tint(column)}`}
                  >
                    {typeof value === "boolean" ? (
                      <span className="inline-flex items-center justify-center">
                        <Icon
                          icon={value ? CheckCircleIcon : MinusIcon}
                          size="lg"
                          label={value ? yesLabel : noLabel}
                          {...(value ? { className: "text-good" } : {})}
                        />
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className={`${CELL} ${PINNED}`} />
            {columns.map((column) => (
              <td key={column.name} className={`${CELL} ${COLUMN} ${tint(column)}`}>
                <Button
                  as={linkAs ?? "a"}
                  href={column.cta.href}
                  variant="secondary"
                  arrow
                  aria-label={`${column.cta.label}: ${column.name}`}
                  className="w-full"
                >
                  {column.cta.label}
                </Button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
