/**
 * Telugu Plate foods (pages.md: Telugu Plate), in the doc's order. Protein per portion is
 * approximate and [CONFIRM] by a nutritionist; this file is the only place the values live.
 */
export const PLATE_FOODS = [
  { id: "rice", proteinG: 4 },
  { id: "pappu", proteinG: 7 },
  { id: "perugu", proteinG: 4 },
  { id: "egg", proteinG: 6 },
  { id: "egg-curry", proteinG: 12 },
  { id: "chicken-curry", proteinG: 25 },
  { id: "fish-curry", proteinG: 20 },
  { id: "pesarattu", proteinG: 7 },
  { id: "idli", proteinG: 4 },
  { id: "chapati", proteinG: 3 },
  { id: "paneer", proteinG: 18 },
  { id: "soya", proteinG: 15 },
  { id: "peanuts", proteinG: 7 },
  { id: "milk", proteinG: 6 },
] as const;

export type PlateFoodId = (typeof PLATE_FOODS)[number]["id"];

/** Portions of one food a person can tap in a day; keeps the URL and the total sane. */
export const MAX_PORTIONS = 20;

/** Grams of protein on the plate: portions times protein per portion. Unknown or negative counts add nothing. */
export function plateProtein(portions: Partial<Record<PlateFoodId, number>>): number {
  return PLATE_FOODS.reduce((total, food) => {
    const count = portions[food.id] ?? 0;
    return total + (count > 0 ? Math.min(Math.floor(count), MAX_PORTIONS) * food.proteinG : 0);
  }, 0);
}
