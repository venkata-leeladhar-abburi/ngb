import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { Button } from "../Button";
import { Icon } from "../Icon";
import { Tag } from "../Tag";

interface ProgramCardProps {
  /** Program name, e.g. "Shred 12". */
  name: string;
  /** The card line from home.md section 9, e.g. "Lose fat, keep your food." */
  line?: ReactNode;
  weeks: number;
  /** Price in whole rupees, for display only (the server decides the charged amount). */
  priceInr: number;
  /** Short inclusions shown with check icons (board 08 featured card). */
  features?: readonly ReactNode[];
  /** The one featured program: black card, red edge, the screen's single glow, raised 24 px on desktop. */
  featured?: boolean;
  /** Tag on the featured card: "Most popular". */
  tag?: ReactNode;
  /** The buy link: "Start my plan". */
  cta: { href: string; label: ReactNode };
  /** Localised words: "weeks" and "a day" (pass Telugu on /te pages). */
  weeksLabel?: string;
  perDayLabel?: string;
  headingLevel?: "h2" | "h3";
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Per-day price shown next to every program price (CLAUDE.md): computed, never typed. */
export const perDayPrice = (priceInr: number, weeks: number): number =>
  Math.round(priceInr / (weeks * 7));

/**
 * Program card (board 08, screen A5). Standard cards are oxblood; the featured card is black with a red
 * edge, the one `shadow-sells` glow and the gold tag. Price in Rush Driver, per-day price in mono under it.
 * Program names use GT America Extended (CLAUDE.md), not the display face drawn on board 08.
 *
 * **Use for:** programs for sale: homepage and programs grid; `featured` for the one recommended program.
 *
 * **Not for:** free tools (ToolCard) or videos (VideoCard); more than one featured card in view.
 */
export function ProgramCard({
  name,
  line,
  weeks,
  priceInr,
  features = [],
  featured = false,
  tag,
  cta,
  weeksLabel = "weeks",
  perDayLabel = "a day",
  headingLevel = "h3",
  linkAs,
  className,
}: ProgramCardProps) {
  const Heading = headingLevel;
  return (
    <article
      className={`relative flex flex-col rounded-card p-24 text-primary ${
        featured
          ? "bg-(--program-card-featured-bg) shadow-sells lg:-translate-y-(--program-card-featured-raise)"
          : "border border-subtle bg-(--program-card-standard-bg)"
      } ${className ?? ""}`}
    >
      {featured && tag && (
        <div className="absolute top-0 right-0">
          <Tag>{tag}</Tag>
        </div>
      )}
      <Heading className="font-label text-h3 leading-heading font-bold uppercase">{name}</Heading>
      {line && <p className="mt-8 text-muted">{line}</p>}
      <p className="mt-16 flex items-center gap-8 font-data text-body uppercase">
        <span aria-hidden="true" className="h-16 w-4 bg-action" />
        {weeks} {weeksLabel}
      </p>
      <p className="mt-8 font-display text-h1 leading-display italic">{rupees.format(priceInr)}</p>
      <p className="mt-8 font-data text-body">
        {rupees.format(perDayPrice(priceInr, weeks))} {perDayLabel}
      </p>
      {features.length > 0 && (
        <ul className="mt-16 flex flex-col gap-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-12">
              <Icon icon={CheckCircleIcon} size="lg" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      {/* mt-auto pushes the button to the bottom of equal-height cards; pt-24 keeps the gap above it. */}
      <div className="mt-auto pt-24">
        <Button
          as={linkAs ?? "a"}
          href={cta.href}
          variant={featured ? "primary" : "onRed"}
          className="w-full"
        >
          {cta.label}
        </Button>
      </div>
    </article>
  );
}
