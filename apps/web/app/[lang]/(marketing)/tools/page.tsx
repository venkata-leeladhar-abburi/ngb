import type { Metadata } from "next";

import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/sections/PageHeader";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { ToolsHub } from "@/sections/Tools";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

const PATH = "/tools";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, { title: t.site.nav.tools, description: t.home.tools.sub });
}

/** Free tools hub (handoff §6): every free tool that is built, one tap away. */
export default async function ToolsPage() {
  const { t } = await getPageContent();
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <PageHeader title={t.home.tools.headline} sub={t.home.tools.sub} />
        <ToolsHub />
      </main>
      <SiteFooter path={PATH} />
    </>
  );
}
