import {
  FaqAccordion,
  QuoteCard,
  SectionTitle,
  StudioBackdrop,
  Text,
  TransformationCard,
} from "@ngb/ui";

import type { Program } from "@/content/catalog";
import { getPageContent } from "@/content/lang";

import { programCopy } from "./programCopy";

/** Three results per program (pages.md), placeholders until consented results exist in the CMS. */
const PLACEHOLDER_COUNT = 3;

/**
 * Proof and last doubts (pages.md: Program detail, screen B3): three member results, Nawin's note,
 * the program's questions, and the health line. Results are visible placeholders, never invented people.
 */
export async function ProgramProof({ program }: { program: Program }) {
  const { t } = await getPageContent();
  const detail = t.programDetail;
  const results = t.home.transformations;
  const copy = programCopy(t, program.slug);

  return (
    <StudioBackdrop
      variant="night"
      className="overflow-hidden border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-64 lg:gap-128">
        <section aria-labelledby="proof-title" className="flex flex-col gap-48">
          <SectionTitle id="proof-title">{results.headline}</SectionTitle>
          <ul className="grid gap-x-64 gap-y-48 px-16 md:grid-cols-2 md:px-32 lg:grid-cols-3">
            {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
              <li key={index}>
                <TransformationCard
                  name={results.placeholderName}
                  town={results.placeholderTown}
                  weeks={program.weeks}
                  change={results.placeholderChange}
                  weeksLabel={results.weeks}
                  sliderLabel={results.beforeAfter}
                  permissionLabel={results.placeholderPermission}
                />
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-24 lg:flex-row lg:items-end lg:justify-between">
            {copy.note ? (
              <QuoteCard quote={copy.note} by={detail.noteBy} />
            ) : (
              <Text tone="muted">{detail.missing}</Text>
            )}
            <Text tone="muted" className="max-w-(--container-lead) lg:text-right">
              {t.transformationsPage.finePrint}
            </Text>
          </div>
        </section>
        <section
          aria-labelledby="program-faq-title"
          className="grid gap-24 lg:grid-cols-12 lg:items-start"
        >
          <SectionTitle id="program-faq-title" className="lg:col-span-4">
            {t.home.promise.faqLabel}
          </SectionTitle>
          <div className="flex flex-col gap-24 lg:col-span-8">
            {copy.faq.length > 0 ? (
              <FaqAccordion items={copy.faq} headingLevel="h3" />
            ) : (
              <Text tone="muted">{detail.missing}</Text>
            )}
            <Text tone="muted">{t.home.footer.health}</Text>
          </div>
        </section>
      </div>
    </StudioBackdrop>
  );
}
