import { SectionTitle, StudioBackdrop, Text } from "@ngb/ui";

import { programs } from "@/content/catalog";
import { getPageContent } from "@/content/lang";

import { PlanCard, PROGRAMS_ID } from "../ProgramsGrid";

import { fitsFilter, PROGRAM_FILTERS } from "./programFilter";
import { ProgramsFilter } from "./ProgramsFilter";

/**
 * Programs page header (pages.md: Programs, screen B1): the page title on the red studio, the filter
 * chips and the four program cards, the same cards as the homepage. Only the featured card glows.
 * Prices are [CONFIRM] (catalog.ts).
 */
export async function ProgramsHeader() {
  const { lang, t } = await getPageContent();
  const copy = t.home.programs;

  return (
    <StudioBackdrop
      as="section"
      id={PROGRAMS_ID}
      aria-labelledby="programs-title"
      className="px-page pt-64 pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-32">
        <div className="flex flex-col gap-16">
          <SectionTitle as="h1" id="programs-title">
            {copy.headline}
          </SectionTitle>
          <Text variant="lead">{copy.sub}</Text>
        </div>
        <ProgramsFilter
          filtersLabel={t.programs.filtersLabel}
          filterLabels={t.programs.filters}
          shownLabel={t.programs.shown}
          cards={programs.map((program) => ({
            slug: program.slug,
            fits: PROGRAM_FILTERS.filter((filter) => fitsFilter(program, filter)),
            card: <PlanCard program={program} lang={lang} t={t} headingLevel="h2" />,
          }))}
        />
      </div>
    </StudioBackdrop>
  );
}
