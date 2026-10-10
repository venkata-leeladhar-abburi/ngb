import type { ReactNode } from "react";

interface PriceOptionProps {
  /** Price in whole rupees, for display only (the server decides the charged amount). */
  priceInr: number;
  /** What the price buys, right after it: "once", "a month", "a year". */
  period: ReactNode;
  /** One supporting line: "about ₹24 a day, lifetime access" or "save 33%". */
  note?: ReactNode;
  /** Layout only. */
  className?: string;
}

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * A price with its period and one supporting line: the price in Rush Driver, the rest in mono
 * (board 04: prices and big numbers). Bone text only, so it sits on the black page, a card or the
 * red studio. It is not a control; put the button next to it.
 *
 * **Use for:** a single price outside a program card: program detail hero, Club monthly and yearly, 1:1 Coaching.
 *
 * **Not for:** program cards (ProgramCard has its own price); tool results (ResultCard); the pay button's amount.
 */
export function PriceOption({ priceInr, period, note, className }: PriceOptionProps) {
  return (
    <div className={`flex flex-col gap-8 text-primary ${className ?? ""}`}>
      <p className="flex flex-wrap items-baseline gap-x-12">
        {/* Digits only: lang="en" keeps Rush Driver on Telugu pages (base.css [lang|="en"]). */}
        <span lang="en" className="font-display text-h1 leading-display italic">
          {rupees.format(priceInr)}
        </span>
        <span className="font-data text-body">{period}</span>
      </p>
      {note && <p className="font-data text-body">{note}</p>}
    </div>
  );
}
