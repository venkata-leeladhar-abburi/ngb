/**
 * Daily calories (pages.md: Free tool page). Mifflin-St Jeor resting energy times an activity
 * factor. The four activity levels are in pages.md; their factors are the standard ones used with
 * this equation and are [CONFIRM] with a qualified nutritionist. Not medical advice.
 */

export const SEXES = ["male", "female"] as const;
export type Sex = (typeof SEXES)[number];

/** Mostly sitting, light exercise, train 3 to 5 days, very active. [CONFIRM] */
export const ACTIVITY_FACTORS = { sitting: 1.2, light: 1.375, train: 1.55, active: 1.725 } as const;
export type Activity = keyof typeof ACTIVITY_FACTORS;
export const ACTIVITIES = Object.keys(ACTIVITY_FACTORS) as Activity[];

export interface Body {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
}

/** Resting energy in kcal a day (Mifflin-St Jeor). */
export function restingCalories({ sex, age, heightCm, weightKg }: Body): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

/** Calories to stay the same weight, rounded to the nearest 10 kcal. */
export function dailyCalories(body: Body, activity: Activity): number {
  return Math.round((restingCalories(body) * ACTIVITY_FACTORS[activity]) / 10) * 10;
}

/** pages.md explainer: "To gain, eat about 300 kcal more." */
export const GAIN_SURPLUS_KCAL = 300;

/** Calories to gain about 0.25 to 0.5 kg a week (pages.md: Weight-gain). */
export const weightGainCalories = (body: Body, activity: Activity): number =>
  dailyCalories(body, activity) + GAIN_SURPLUS_KCAL;
