const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Whole rupees with Indian grouping: 1999 is "₹1,999", 100000 is "₹1,00,000" (voice.md). */
export const formatInr = (amountInr: number): string => rupees.format(amountInr);
