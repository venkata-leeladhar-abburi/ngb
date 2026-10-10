import type { Metadata } from "next";

import { getPageContent } from "@/content/lang";
import { NotFound, notFoundCopy } from "@/sections/NotFound";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";

export const metadata: Metadata = { title: "404", robots: { index: false } };

/** 404 inside a language (pages.md: 404, screen C3). The language switch goes to that language's homepage. */
export default async function NotFoundPage() {
  const { lang, t } = await getPageContent();
  return (
    <>
      <SiteHeader path="/" />
      <main id="main">
        <NotFound {...notFoundCopy(lang, t)} />
      </main>
      <SiteFooter path="/" />
    </>
  );
}
