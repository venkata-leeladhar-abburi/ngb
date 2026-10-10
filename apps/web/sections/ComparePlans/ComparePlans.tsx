import { CompareTable, SectionTitle, StudioBackdrop } from "@ngb/ui";
import NextLink from "next/link";

import { programs } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { formatInr } from "@/lib/format";

import { ClubCoachingCards } from "../ClubCoachingCards";

/** The phone sticky bar hides over the table: every column has its own "Start my plan". */
export const COMPARE_ID = "compare";

/**
 * Compare the plans (pages.md: Programs, screen B1): the six facts side by side, a buy link under
 * each column, then the Club and 1:1 Coaching cards. Facts come from catalog.ts; "home or gym" for
 * Shred 12 and Mass Builder and every price are [CONFIRM].
 */
export async function ComparePlans() {
  const { lang, t } = await getPageContent();
  const copy = t.programs.compare;

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      id={COMPARE_ID}
      aria-labelledby="compare-title"
      className="px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <SectionTitle id="compare-title">{copy.title}</SectionTitle>
        <CompareTable
          caption={copy.title}
          columns={programs.map((program) => ({
            name: program.name,
            featured: program.featured,
            cta: { href: localePath(lang, `/programs/${program.slug}`), label: t.site.buy },
          }))}
          rows={[
            { label: copy.rows.weeks, cells: programs.map((program) => program.weeks) },
            { label: copy.rows.days, cells: programs.map((program) => program.daysPerWeek) },
            { label: copy.rows.minutes, cells: programs.map((program) => program.minutes) },
            {
              label: copy.rows.place,
              cells: programs.map((program) => copy.places[program.place]),
              words: true,
            },
            { label: copy.rows.hostel, cells: programs.map((program) => program.hostel) },
            {
              label: copy.rows.price,
              cells: programs.map((program) => formatInr(program.priceInr)),
            },
          ]}
          yesLabel={copy.yes}
          noLabel={copy.no}
          linkAs={NextLink}
        />
        <ClubCoachingCards first="club" />
      </div>
    </StudioBackdrop>
  );
}
