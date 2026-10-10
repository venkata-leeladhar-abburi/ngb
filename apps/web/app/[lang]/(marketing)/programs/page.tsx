import type { Metadata } from "next";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { COMPARE_ID, ComparePlans } from "@/sections/ComparePlans";
import { PROGRAMS_ID } from "@/sections/ProgramsGrid";
import { ProgramsHeader } from "@/sections/ProgramsHeader";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { StickyActions } from "@/sections/StickyActions";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/programs";

/** The phone bar hides over the sections that carry "Start my plan" themselves. */
const HIDE_STICKY_OVER = [PROGRAMS_ID, COMPARE_ID];

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, {
    title: t.site.nav.programs,
    description: t.home.programs.sub,
  });
}

/** Programs (pages.md: Programs, screen B1): pick a plan, compare the four, or go to the Club or 1:1. */
export default async function ProgramsPage() {
  const { lang, t } = await getPageContent();
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <ProgramsHeader />
        <ComparePlans />
      </main>
      <SiteFooter path={PATH} />
      <StickyActions
        hideOver={HIDE_STICKY_OVER}
        label={t.site.stickyLabel}
        buy={{ href: `#${PROGRAMS_ID}`, label: t.site.buy }}
        free={{ href: localePath(lang, "/tools"), label: t.site.free }}
      />
    </>
  );
}
