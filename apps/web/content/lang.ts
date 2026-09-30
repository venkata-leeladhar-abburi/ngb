import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";

import { getContent, isLang, type Content, type Lang } from "./index";

/**
 * The page language from the `[lang]` root segment, readable in any Server Component without prop
 * drilling. English is served unprefixed through a rewrite (next.config.ts), so "/" arrives as "en".
 */
export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  if (!isLang(value)) notFound();
  return value;
}

/** Copy for the current page language. */
export async function getPageContent(): Promise<{ lang: Lang; t: Content }> {
  const lang = await getLang();
  return { lang, t: getContent(lang) };
}
