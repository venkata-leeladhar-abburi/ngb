import { QuoteCard, StudioBackdrop, Text } from "@ngb/ui";

import { getPageContent } from "@/content/lang";

import { PAGE_TITLE_ID } from "../PageHeader";
import { ResultsFilter } from "../TransformationsRow";

/** Six placeholder cards (screens.md B8) until real consented results exist in the CMS. */
const PLACEHOLDER_COUNT = 6;

/**
 * Transformations page body (pages.md: Transformations): the filter chips, a grid of before/after
 * cards, one member quote and the fine print. No real member results exist yet, so every card and
 * the quote are visible placeholders ([Name], [City], [REAL DATA]); never invented people.
 */
export async function TransformationsGrid() {
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
      aria-labelledby={PAGE_TITLE_ID}
      className="overflow-hidden px-page pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <ResultsFilter
          layout="grid"
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
          <Text tone="muted" className="max-w-(--container-lead) lg:text-right">
            {t.transformationsPage.finePrint}
          </Text>
        </div>
      </div>
    </StudioBackdrop>
  );
}
