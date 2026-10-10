import type { Metadata } from "next";

import { social } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { env } from "@/env";
import { JsonLd } from "@/lib/jsonLd";
import { pageMetadata } from "@/lib/seo";
import { AboutHero } from "@/sections/AboutHero";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { StickyActions } from "@/sections/StickyActions";
import { StoryTimeline } from "@/sections/StoryTimeline";
import { TOOLS_ID } from "@/sections/ToolsBento";
import { VALUES_ID, ValuesRow } from "@/sections/ValuesRow";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/about";

/** The phone bar hides over the section that carries "Start my plan" itself. */
const HIDE_STICKY_OVER = [VALUES_ID];

const SAME_AS = [social.instagram, social.youtube];

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, { title: t.site.nav.about, description: t.about.headline });
}

/** About (pages.md: About, screen B7): who Nawin is, his story in five parts and what he stands for. */
export default async function AboutPage() {
  const { lang, t } = await getPageContent();
  const site = env.NEXT_PUBLIC_SITE_URL;
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <AboutHero />
        <StoryTimeline />
        <ValuesRow />
      </main>
      <SiteFooter path={PATH} />
      <StickyActions
        hideOver={HIDE_STICKY_OVER}
        label={t.site.stickyLabel}
        buy={{ href: localePath(lang, "/programs"), label: t.site.buy }}
        free={{ href: `${localePath(lang, "/")}#${TOOLS_ID}`, label: t.site.free }}
      />
      {/* Only facts the docs hold (handoff §3): the two names, the site and the follow links. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${site}/about#nawin`,
              name: "Nawin Golden Boy",
              alternateName: "Naveen",
              url: `${site}/about`,
              sameAs: SAME_AS,
            },
            {
              "@type": "Organization",
              "@id": `${site}/#organization`,
              name: t.site.name,
              url: site,
              founder: { "@id": `${site}/about#nawin` },
              sameAs: SAME_AS,
            },
          ],
        }}
      />
    </>
  );
}
