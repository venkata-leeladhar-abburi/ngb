import type { ProgramSlug } from "@/content/catalog";

/** The four questions (pages.md: Find my plan quiz), in order, with their answers. */
export const QUIZ = {
  goal: ["gain", "lose", "stronger", "lean"],
  place: ["gym", "home", "both"],
  level: ["never", "under6", "over6"],
  food: ["veg", "egg", "nonveg"],
} as const;

export type QuizStep = keyof typeof QUIZ;
export const QUIZ_STEPS = Object.keys(QUIZ) as QuizStep[];

export type QuizAnswers = { [Step in QuizStep]: (typeof QUIZ)[Step][number] };

export const isAnswer = <Step extends QuizStep>(
  step: Step,
  value: string | null,
): value is QuizAnswers[Step] =>
  value !== null && (QUIZ[step] as readonly string[]).includes(value);

/** The answers in a URL query, or null for each question not answered (or answered with junk). */
export function readAnswers(params: URLSearchParams): Partial<QuizAnswers> {
  const answers: Partial<Record<QuizStep, string>> = {};
  for (const step of QUIZ_STEPS) {
    const value = params.get(step);
    // Stop at the first gap: a later answer without the earlier ones is not a finished quiz.
    if (!isAnswer(step, value)) break;
    answers[step] = value;
  }
  return answers as Partial<QuizAnswers>;
}

export const isComplete = (answers: Partial<QuizAnswers>): answers is QuizAnswers =>
  QUIZ_STEPS.every((step) => answers[step] !== undefined);

/**
 * The one program the quiz ends on (handoff §7: never three options). The rule is [CONFIRM] with
 * Nawin; pages.md gives only one worked example (gain weight + gym + hostel food = Mass Builder).
 * 1. Never trained: Foundation Plan. 2. Trains at home: Master the Bodyweight.
 * 3. Lose fat or look lean: Shred 12. 4. Gain weight or get stronger: Mass Builder.
 */
export function pickProgram({ goal, place, level }: QuizAnswers): ProgramSlug {
  if (level === "never") return "foundation-plan";
  if (place === "home") return "master-the-bodyweight";
  return goal === "lose" || goal === "lean" ? "shred-12" : "mass-builder";
}
