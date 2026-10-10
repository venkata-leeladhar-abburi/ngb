/**
 * The URL query after a filter choice: the default choice removes the parameter, anything else sets
 * it. Other parameters (utm tags from a Reel) are kept.
 */
export function choiceQuery(search: string, param: string, value: string | null): string {
  const params = new URLSearchParams(search);
  if (value === null) params.delete(param);
  else params.set(param, value);
  const query = params.toString();
  return query ? `?${query}` : "";
}
