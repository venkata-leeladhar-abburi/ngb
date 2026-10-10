import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { langs } from "@/content";
import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";
import { BUILT_TOOLS, isBuiltTool, ToolPage } from "@/sections/Tools";

// Static: the tools calculate in the browser, so the page itself is served from the CDN.
export const dynamic = "error";

export function generateStaticParams() {
  return langs.flatMap((lang) => BUILT_TOOLS.map((slug) => ({ lang, slug })));
}

type Props = PageProps<"/[lang]/tools/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isBuiltTool(slug)) return {};
  const { lang, t } = await getPageContent();
  const copy = t.toolPages.tools[slug];
  return pageMetadata(lang, `/tools/${slug}`, {
    title: copy.headline,
    description: "sub" in copy ? copy.sub : t.home.tools.sub,
  });
}

/** One free tool (pages.md: Free tool page, Telugu Plate; screens B4 and B5). */
export default async function ToolRoute({ params }: Props) {
  const { slug } = await params;
  if (!isBuiltTool(slug)) notFound();
  const path = `/tools/${slug}` as const;
  return (
    <>
      <SiteHeader path={path} />
      <main id="main">
        <ToolPage tool={slug} />
      </main>
      <SiteFooter path={path} />
    </>
  );
}
