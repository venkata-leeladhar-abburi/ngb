"use client";

import { ChipGroup, VisuallyHidden } from "@ngb/ui";
import { useState, type ReactNode } from "react";

import { useUrlChoice } from "../shared/useUrlChoice";

import { isProgramFilter, PROGRAM_FILTERS, type ProgramFilter } from "./programFilter";

interface ProgramsFilterProps {
  filtersLabel: string;
  filterLabels: Record<ProgramFilter, string>;
  /** Read out after a choice: "Plans shown: {count}". */
  shownLabel: string;
  /** The cards, rendered on the server, each with the filters it belongs under. */
  cards: readonly { slug: string; fits: readonly ProgramFilter[]; card: ReactNode }[];
}

/**
 * Filter chips over the program cards (pages.md: Programs). The choice lives in the URL (`?fit=gym`,
 * see useUrlChoice). Cards that do not match are hidden, not removed, so the server HTML holds all four.
 */
export function ProgramsFilter({
  filtersLabel,
  filterLabels,
  shownLabel,
  cards,
}: ProgramsFilterProps) {
  const [filter, setFilter] = useUrlChoice("fit", isProgramFilter, "all");
  // Empty until the visitor chooses, so the page load announces nothing.
  const [chosen, setChosen] = useState(false);
  const choose = (value: string) => {
    setChosen(true);
    setFilter(value);
  };
  const shown = cards.filter(({ fits }) => fits.includes(filter)).length;

  return (
    <div className="flex flex-col gap-48">
      <ChipGroup
        label={filtersLabel}
        hideLabel
        options={PROGRAM_FILTERS.map((value) => ({ value, label: filterLabels[value] }))}
        value={filter}
        onValueChange={choose}
      />
      <VisuallyHidden as="p" role="status">
        {chosen ? shownLabel.replace("{count}", String(shown)) : ""}
      </VisuallyHidden>
      <ul className="grid gap-24 md:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
        {cards.map(({ slug, fits, card }) => (
          <li key={slug} hidden={!fits.includes(filter)} className="flex flex-col">
            {card}
          </li>
        ))}
      </ul>
    </div>
  );
}
