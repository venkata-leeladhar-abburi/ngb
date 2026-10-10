import type { Program, ProgramSlug } from "@/content/catalog";
import { programs } from "@/content/catalog";
import type { Content } from "@/content";

/** One program's page copy (pages.md: Program detail). Empty fields are copy that is not written yet. */
export interface ProgramCopy {
  sub: string;
  forYou: string;
  notForYou: string;
  schedule: string;
  food: string;
  phases: readonly { title: string; line: string }[];
  hostelDay: readonly { meal: string; food: string }[];
  inside: readonly string[];
  note: string;
  faq: readonly { question: string; answer: string }[];
}

export const isProgramSlug = (value: string): value is ProgramSlug =>
  programs.some((program) => program.slug === value);

export function findProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export const programCopy = (t: Content, slug: ProgramSlug): ProgramCopy =>
  t.programDetail.programs[slug];
