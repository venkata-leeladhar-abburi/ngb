const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Whole rupees with Indian grouping: 1999 is "₹1,999", 100000 is "₹1,00,000" (voice.md). */
export const formatInr = (amountInr: number): string => rupees.format(amountInr);

const grouped = new Intl.NumberFormat("en-IN");

/** A whole number with Indian grouping: 2590 is "2,590". */
export const formatNumber = (value: number): string => grouped.format(value);

/** Fills `{name}` slots in a line of copy: fill("{kcal} kcal", { kcal: "2,590" }). */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (slot, name: string) => String(values[name] ?? slot));
