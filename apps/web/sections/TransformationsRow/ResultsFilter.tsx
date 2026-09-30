"use client";

import { ChipGroup, SwipeRow, Text, TransformationCard } from "@ngb/ui";
import { useSyncExternalStore } from "react";

import { isResultFilter, RESULT_FILTERS, resultQuery, type ResultFilter } from "./resultFilter";

/** Fired after this component rewrites the URL (replaceState fires no event of its own). */
const URL_CHANGE = "ngb:result-filter";

function subscribeToHistory(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_CHANGE, onChange);
  };
}

function filterFromUrl(): ResultFilter {
  const value = new URLSearchParams(window.location.search).get("result");
  return isResultFilter(value) ? value : "all";
}

interface ResultCardCopy {
  name: string;
  town: string;
  change: string;
  permission: string;
}

interface ResultsFilterProps {
  filtersLabel: string;
  filterLabels: Record<ResultFilter, string>;
  /** Placeholder cards until consented results exist in the CMS; they belong to no group, so only "all" shows them. */
  cards: readonly ResultCardCopy[];
  weeks: number;
  weeksLabel: string;
  sliderLabel: string;
  rowLabel: string;
  previousLabel: string;
  nextLabel: string;
  emptyLabel: string;
}

/**
 * Filter chips and the swipe row of member results (home.md §8). The choice lives in the URL
 * (`?result=lost`) so refresh and back work in the Instagram browser; the page stays static, so the
 * query is read after hydration and written with history.replaceState (no navigation, no server).
 */
export function ResultsFilter({
  filtersLabel,
  filterLabels,
  cards,
  weeks,
  weeksLabel,
  sliderLabel,
  rowLabel,
  previousLabel,
  nextLabel,
  emptyLabel,
}: ResultsFilterProps) {
  // The URL is the only state: the static HTML is rendered for "all", then the URL decides, and back
  // and forward stay in step.
  const filter = useSyncExternalStore(subscribeToHistory, filterFromUrl, () => "all" as const);

  const choose = (value: string) => {
    if (!isResultFilter(value)) return;
    const { pathname, search, hash } = window.location;
    window.history.replaceState(null, "", `${pathname}${resultQuery(search, value)}${hash}`);
    window.dispatchEvent(new Event(URL_CHANGE));
  };

  const shown = filter === "all" ? cards : [];

  return (
    <div className="flex flex-col gap-32">
      <ChipGroup
        label={filtersLabel}
        hideLabel
        options={RESULT_FILTERS.map((value) => ({ value, label: filterLabels[value] }))}
        value={filter}
        onValueChange={choose}
      />
      {shown.length > 0 && (
        <SwipeRow
          label={rowLabel}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          itemClassName="w-4/5 md:w-2/5 lg:w-1/4"
          className="-mx-page lg:mx-0"
          items={shown.map((card, index) => (
            <TransformationCard
              key={index}
              name={card.name}
              town={card.town}
              weeks={weeks}
              change={card.change}
              weeksLabel={weeksLabel}
              sliderLabel={sliderLabel}
              permissionLabel={card.permission}
            />
          ))}
        />
      )}
      {/* Announces only the empty line, not a whole row of cards. */}
      <div aria-live="polite">{shown.length === 0 && <Text tone="muted">{emptyLabel}</Text>}</div>
    </div>
  );
}
