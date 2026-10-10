import type { Program } from "@/content/catalog";

import { choiceQuery } from "../shared/urlChoice";

/** Filter values, in pages.md order; `?fit=` holds the choice ("all" is the default, no param). */
export const PROGRAM_FILTERS = ["all", "gym", "home", "beginner", "hostel"] as const;
export type ProgramFilter = (typeof PROGRAM_FILTERS)[number];

export const isProgramFilter = (value: string | null): value is ProgramFilter =>
  value !== null && (PROGRAM_FILTERS as readonly string[]).includes(value);

/** Whether a program belongs under a filter. A plan for "home or gym" shows under both. */
export function fitsFilter(
  program: Pick<Program, "place" | "beginner" | "hostel">,
  filter: ProgramFilter,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "gym":
    case "home":
      return program.place === filter || program.place === "both";
    case "beginner":
      return program.beginner;
    case "hostel":
      return program.hostel;
  }
}

/** The URL query for a filter: "all" removes the parameter, anything else sets it. */
export const programQuery = (search: string, filter: ProgramFilter): string =>
  choiceQuery(search, "fit", filter === "all" ? null : filter);
