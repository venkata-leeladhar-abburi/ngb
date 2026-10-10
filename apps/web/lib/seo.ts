import type { Metadata } from "next";

import { localePath, type Lang } from "@/content";

/**
 * Metadata every marketing page shares: its title and description, the canonical URL in its own
 * language, and hreflang links between the English and Telugu versions (English is the default).
 * URLs are relative; the root layout's `metadataBase` makes them absolute.
 */
export function pageMetadata(
  lang: Lang,
  path: `/${string}`,
  { title, description }: { title: string; description: string },
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localePath(lang, path),
      languages: {
        en: localePath("en", path),
        te: localePath("te", path),
        "x-default": localePath("en", path),
      },
    },
  };
}
