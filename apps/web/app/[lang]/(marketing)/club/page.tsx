import type { Metadata } from "next";

import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { ClubPricing } from "@/sections/ClubPricing";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/club";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, {
    title: t.home.footer.links.club,
    description: t.club.sub,
  });
}

/** NGB Evolve Club (pages.md: NGB Evolve Club, screen C2): every plan, every month. */
export default function Page() {
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <ClubPricing />
      </main>
      <SiteFooter path={PATH} />
    </>
  );
}
