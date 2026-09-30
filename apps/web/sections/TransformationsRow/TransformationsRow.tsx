import { QuoteCard, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";

import { getPageContent } from "@/content/lang";

import { ResultsFilter } from "./ResultsFilter";

/** Four placeholder cards, as in screen A4, until real consented results exist in the CMS. */
const PLACEHOLDER_COUNT = 4;

/**
 * Transformations (home.md §8, screen A4): filter chips, a swipe row of leaning before/after cards, one
 * member quote and the fine print. No real member results exist yet, so every card and the quote are
 * visible placeholders ([Name], [City], [REAL DATA]); never invented people.
 */
export async function TransformationsRow() {
  const { t } = await getPageContent();
  const results = t.home.transformations;
  const card = {
    name: results.placeholderName,
    town: results.placeholderTown,
    change: results.placeholderChange,
    permission: results.placeholderPermission,
  };

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      id="results"
      aria-labelledby="results-title"
      className="overflow-hidden border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <div className="flex flex-col gap-16">
          <SectionTitle id="results-title">{results.headline}</SectionTitle>
          <Text variant="lead" tone="muted">
            {results.sub}
          </Text>
        </div>
        <ResultsFilter
          filtersLabel={results.filtersLabel}
          filterLabels={results.filters}
          cards={Array.from({ length: PLACEHOLDER_COUNT }, () => card)}
          weeks={12}
          weeksLabel={results.weeks}
          sliderLabel={results.beforeAfter}
          rowLabel={results.rowLabel}
          previousLabel={results.previous}
          nextLabel={results.next}
          emptyLabel={results.empty}
        />
        <div className="flex flex-col gap-24 lg:flex-row lg:items-end lg:justify-between">
          <QuoteCard quote={results.quotePlaceholder} by={results.quoteByPlaceholder} />
          {/* home.md §8 fine print. Its second sentence ("These are real members...") would be false
              next to placeholders, so finePrintMembers joins it only once real results exist. */}
          <Text tone="muted" className="max-w-(--container-lead) lg:text-right">
            {results.finePrint}
          </Text>
        </div>
      </div>
    </StudioBackdrop>
  );
}
