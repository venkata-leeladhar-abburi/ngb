import en from "./en.json";
import te from "./te.json";

/** The site's languages. English is served unprefixed, Telugu under /te. */
export const langs = ["en", "te"] as const;
export type Lang = (typeof langs)[number];

export type Content = typeof en;

// Typed as Content, so a key missing from te.json (or added only to te.json) fails the typecheck.
const telugu: Content = te;

const content: Record<Lang, Content> = { en, te: telugu };

/** Marker for Telugu lines the native copywriter has not written yet (never machine-translated). */
export const TODO_TE = "TODO(te)";

export const isLang = (value: string): value is Lang =>
  (langs as readonly string[]).includes(value);

/** Fallback copy for a language (Payload CMS becomes the main source in Phase 7). */
export function getContent(lang: Lang): Content {
  return content[lang];
}

/** The page path in a language: "/" stays "/" in English and becomes "/te" in Telugu. */
export function localePath(lang: Lang, path: `/${string}`): string {
  if (lang === "en") return path;
  return path === "/" ? "/te" : `/te${path}`;
}
