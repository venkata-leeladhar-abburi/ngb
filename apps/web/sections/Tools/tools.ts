import type { ProgramSlug, ToolSlug } from "@/content/catalog";

/** The tools that are built. One-rep max, body fat and water wait for a confirmed method. */
export const CALC_TOOLS = ["calorie-calculator", "weight-gain", "protein", "bmi"] as const;
export type CalcTool = (typeof CALC_TOOLS)[number];

export const BUILT_TOOLS = ["telugu-plate", ...CALC_TOOLS] as const satisfies readonly ToolSlug[];
export type BuiltTool = (typeof BUILT_TOOLS)[number];

export const isBuiltTool = (value: string): value is BuiltTool =>
  (BUILT_TOOLS as readonly string[]).includes(value);

export const isCalcTool = (value: string): value is CalcTool =>
  (CALC_TOOLS as readonly string[]).includes(value);

/** The inputs each calculator asks for, in pages.md order. */
export const TOOL_FIELDS = {
  "calorie-calculator": ["age", "sex", "height", "weight", "activity", "goal"],
  "weight-gain": ["age", "sex", "height", "weight", "activity"],
  protein: ["weight"],
  bmi: ["height", "weight"],
} as const satisfies Record<CalcTool, readonly string[]>;

export type ToolField = (typeof TOOL_FIELDS)[CalcTool][number];

export const GOALS = ["lose", "same", "gain"] as const;
export type Goal = (typeof GOALS)[number];

/**
 * The program a result recommends (pages.md: "Recommends"). The calorie calculator goes by goal;
 * "stay the same" and the protein target ("by goal", but it asks for none) recommend nothing.
 */
export function recommendedProgram(tool: CalcTool, goal: Goal | null): ProgramSlug | null {
  switch (tool) {
    case "calorie-calculator":
      return goal === "lose" ? "shred-12" : goal === "gain" ? "mass-builder" : null;
    case "weight-gain":
      return "mass-builder";
    case "bmi":
      return "foundation-plan";
    case "protein":
      return null;
  }
}
