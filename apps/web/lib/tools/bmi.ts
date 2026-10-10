/** Asian cut-offs: 18.5 to 22.9 is the healthy range (CLAUDE.md, pages.md: BMI). */
export const HEALTHY_BMI = { min: 18.5, max: 22.9 } as const;

/** Body mass index to one decimal. */
export function bmi(weightKg: number, heightCm: number): number {
  const metres = heightCm / 100;
  return Math.round((weightKg / (metres * metres)) * 10) / 10;
}

export const isHealthyBmi = (value: number): boolean =>
  value >= HEALTHY_BMI.min && value <= HEALTHY_BMI.max;

/** The healthy weight range for a height, in whole kg. */
export function healthyWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  const square = (heightCm / 100) ** 2;
  return {
    minKg: Math.round(HEALTHY_BMI.min * square),
    maxKg: Math.round(HEALTHY_BMI.max * square),
  };
}
