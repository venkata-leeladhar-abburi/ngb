/** Protein target: about 1.6 g per kg of body weight (CLAUDE.md, pages.md). */
export const PROTEIN_G_PER_KG = 1.6;

/** Grams of protein a day, to the nearest gram. */
export const proteinTarget = (weightKg: number): number => Math.round(weightKg * PROTEIN_G_PER_KG);
