import { ProgramCard, Reveal } from "@ngb/ui";
import NextLink from "next/link";

import type { Program } from "@/content/catalog";
import { localePath, type Content, type Lang } from "@/content";

interface PlanCardProps {
  program: Program;
  lang: Lang;
  t: Content;
  /** h3 under a section title (home); h2 where the cards sit straight under the page's h1. */
  headingLevel?: "h2" | "h3";
}

/**
 * One program card with its copy and link, the same on the homepage and the programs page (home.md §9).
 * The featured card rises into place once.
 */
export function PlanCard({ program, lang, t, headingLevel = "h3" }: PlanCardProps) {
  const copy = t.home.programs;
  const card = (
    <ProgramCard
      name={program.name}
      line={copy.lines[program.slug]}
      weeks={program.weeks}
      priceInr={program.priceInr}
      featured={program.featured}
      {...(program.featured ? { tag: copy.popular } : {})}
      cta={{ href: localePath(lang, `/programs/${program.slug}`), label: t.site.buy }}
      weeksLabel={copy.weeks}
      perDayLabel={copy.perDay}
      headingLevel={headingLevel}
      linkAs={NextLink}
      className="h-full"
    />
  );
  return program.featured ? (
    <Reveal effect="rise" className="h-full">
      {card}
    </Reveal>
  ) : (
    card
  );
}
