import type { Metadata } from "next";

import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { CoachingApply } from "@/sections/CoachingApply";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/coaching";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, {
    title: t.home.footer.links.coaching,
    description: t.coaching.sub,
  });
}

/** 1:1 Coaching (pages.md: 1:1 Coaching, screen C2): the premium application. */
export default function Page() {
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <CoachingApply />
      </main>
      <SiteFooter path={PATH} />
    </>
  );
}
