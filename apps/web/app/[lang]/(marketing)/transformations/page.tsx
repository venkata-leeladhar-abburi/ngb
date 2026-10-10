import type { Metadata } from "next";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/sections/PageHeader";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { StickyActions } from "@/sections/StickyActions";
import { TOOLS_ID } from "@/sections/ToolsBento";
import { TransformationsGrid } from "@/sections/TransformationsGrid";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/transformations";

/** No section here carries "Start my plan", so the phone bar stays. */
const HIDE_STICKY_OVER: readonly string[] = [];

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, {
    title: t.site.nav.transformations,
    description: t.transformationsPage.sub,
  });
}

/** Transformations (pages.md: Transformations, screen B8): member results, filterable. Placeholders for now. */
export default async function TransformationsPage() {
  const { lang, t } = await getPageContent();
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <PageHeader title={t.home.transformations.headline} sub={t.transformationsPage.sub} />
        <TransformationsGrid />
      </main>
      <SiteFooter path={PATH} />
      <StickyActions
        hideOver={HIDE_STICKY_OVER}
        label={t.site.stickyLabel}
        buy={{ href: localePath(lang, "/programs"), label: t.site.buy }}
        free={{ href: `${localePath(lang, "/")}#${TOOLS_ID}`, label: t.site.free }}
      />
    </>
  );
}
