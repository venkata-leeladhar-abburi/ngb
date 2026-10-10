import type { Metadata } from "next";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { JsonLd } from "@/lib/jsonLd";
import { pageMetadata } from "@/lib/seo";
import { FAQ_GROUPS, FaqGroups } from "@/sections/FaqGroups";
import { PageHeader } from "@/sections/PageHeader";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { StickyActions } from "@/sections/StickyActions";
import { TOOLS_ID } from "@/sections/ToolsBento";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/faq";

/** No section here carries "Start my plan", so the phone bar stays. */
const HIDE_STICKY_OVER: readonly string[] = [];

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, {
    title: t.home.footer.links.faq,
    description: FAQ_GROUPS.map((id) => t.faq.groups[id].title).join(", "),
  });
}

/** Full FAQ (pages.md: Full FAQ, screen C3): the most-asked questions in five groups. */
export default async function FaqPage() {
  const { lang, t } = await getPageContent();
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <PageHeader title={t.home.promise.allQuestions} />
        <FaqGroups />
      </main>
      <SiteFooter path={PATH} />
      <StickyActions
        hideOver={HIDE_STICKY_OVER}
        label={t.site.stickyLabel}
        buy={{ href: localePath(lang, "/programs"), label: t.site.buy }}
        free={{ href: `${localePath(lang, "/")}#${TOOLS_ID}`, label: t.site.free }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_GROUPS.flatMap((id) => t.faq.groups[id].items).map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </>
  );
}
