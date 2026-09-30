/**
 * A token's value as the browser sees it ("64rem", "900ms"), read from the CSS variables on <html>.
 * Client code uses this instead of importing `tokens` from @ngb/tokens, which would ship the whole
 * token tree to every page. Call it in effects or handlers only (it needs the DOM).
 */
export function cssVar(name: `--${string}`): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** A duration token in milliseconds ("900ms" -> 900, "0.25s" -> 250); 0 if it is not set. */
export function cssDuration(name: `--${string}`): number {
  const value = cssVar(name);
  const number = Number.parseFloat(value);
  if (Number.isNaN(number)) return 0;
  return value.endsWith("ms") ? number : number * 1000;
}
