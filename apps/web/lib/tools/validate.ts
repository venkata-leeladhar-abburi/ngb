/** The limits each number field accepts. Outside them the form shows the range error. */
export const LIMITS = {
  age: { min: 13, max: 80 },
  height: { min: 120, max: 220 },
  weight: { min: 30, max: 200 },
} as const;

export type NumberField = keyof typeof LIMITS;

/** Reads one number field: a value in range, or which error to show. */
export function readNumber(
  field: NumberField,
  raw: string | null,
): { value: number } | { error: "required" | "range" } {
  const text = (raw ?? "").trim();
  if (text === "") return { error: "required" };
  const value = Number(text);
  const { min, max } = LIMITS[field];
  if (!Number.isFinite(value) || value < min || value > max) return { error: "range" };
  return { value };
}
