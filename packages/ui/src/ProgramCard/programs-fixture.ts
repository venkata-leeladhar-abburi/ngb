/** home.md section 9. Prices are [CONFIRM]; per-day prices are computed by the card. */
export const programs = [
  { name: "Foundation Plan", line: "Never trained? Start here.", weeks: 8, priceInr: 1499 },
  {
    name: "Shred 12",
    line: "Lose fat, keep your food.",
    weeks: 12,
    priceInr: 1999,
    featured: true,
  },
  {
    name: "Mass Builder",
    line: "Skinny to strong. Hostel version included.",
    weeks: 12,
    priceInr: 1999,
  },
  { name: "Master the Bodyweight", line: "No gym. No excuses.", weeks: 12, priceInr: 1499 },
] as const;

export const cta = { href: "#start", label: "Start my plan" };

/** home.md section 9 "Every plan includes" (the three shown on board 08). */
export const includes = ["Telugu food diet", "Weekly check-in", "Lifetime access"];
