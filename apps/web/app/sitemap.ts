import type { MetadataRoute } from "next";

import { programs } from "@/content/catalog";
import { localePath } from "@/content";
import { env } from "@/env";
import { BUILT_TOOLS } from "@/sections/Tools/tools";

/**
 * Every public page, in English with its Telugu alternate (handoff §6). Checkout, welcome and the
 * member area are private (robots.ts) and never listed. Add a route here when its page is built.
 */
export const PUBLIC_PATHS: readonly `/${string}`[] = [
  "/",
  "/start",
  "/quiz",
  "/programs",
  ...programs.map((program) => `/programs/${program.slug}` as const),
  "/club",
  "/coaching",
  "/tools",
  ...BUILT_TOOLS.map((tool) => `/tools/${tool}` as const),
  "/workouts",
  "/transformations",
  "/about",
  "/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (lang: "en" | "te", path: `/${string}`) =>
    `${env.NEXT_PUBLIC_SITE_URL}${localePath(lang, path)}`.replace(/\/$/, "");
  return PUBLIC_PATHS.map((path) => ({
    url: url("en", path),
    alternates: { languages: { en: url("en", path), te: url("te", path) } },
  }));
}
