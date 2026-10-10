import { choiceQuery } from "../shared/urlChoice";

/** Filter values, in home.md §8 order; `?result=` holds the choice ("all" is the default, no param). */
export const RESULT_FILTERS = ["all", "gained", "lost", "women", "home"] as const;
export type ResultFilter = (typeof RESULT_FILTERS)[number];

export const isResultFilter = (value: string | null): value is ResultFilter =>
  value !== null && (RESULT_FILTERS as readonly string[]).includes(value);

/** The URL query for a filter: "all" removes the parameter, anything else sets it. */
export const resultQuery = (search: string, filter: ResultFilter): string =>
  choiceQuery(search, "result", filter === "all" ? null : filter);
