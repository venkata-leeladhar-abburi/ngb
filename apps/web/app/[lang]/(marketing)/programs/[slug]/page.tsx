import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { programs } from "@/content/catalog";
import { langs, localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { env } from "@/env";
import { JsonLd } from "@/lib/jsonLd";
import { pageMetadata } from "@/lib/seo";
import {
  findProgram,
  PROGRAM_HERO_ID,
  ProgramBuyBar,
  programCopy,
  ProgramHero,
  ProgramPlan,
  ProgramProof,
} from "@/sections/ProgramDetail";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

/** The phone buy bar hides while the hero's own button is on screen. */
const HIDE_BAR_OVER = [PROGRAM_HERO_ID];

export function generateStaticParams() {
  return langs.flatMap((lang) => programs.map((program) => ({ lang, slug: program.slug })));
}

type Props = PageProps<"/[lang]/programs/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = findProgram(slug);
  if (!program) return {};
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, `/programs/${program.slug}`, {
    title: program.name,
    description: programCopy(t, program.slug).sub,
  });
}

/** Program detail (pages.md: Program detail, screens B2 and B3): one program, one outcome, one button. */
export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const program = findProgram(slug);
  if (!program) notFound();
  const { lang, t } = await getPageContent();
  const path = `/programs/${program.slug}` as const;
  const checkout = localePath(lang, `/checkout/${program.slug}`);

  return (
    <>
      <SiteHeader path={path} />
      <main id="main">
        <ProgramHero program={program} />
        <ProgramPlan program={program} />
        <ProgramProof program={program} />
      </main>
      <SiteFooter path={path} />
      <ProgramBuyBar
        hideOver={HIDE_BAR_OVER}
        name={program.name}
        priceInr={program.priceInr}
        weeks={program.weeks}
        cta={{ href: checkout, label: t.site.buy }}
        perDayLabel={t.home.programs.perDay}
        label={t.site.stickyLabel}
      />
      {/* The price is [CONFIRM] (catalog.ts); no ratings or review counts until real ones exist. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: program.name,
          description: programCopy(t, program.slug).sub,
          brand: { "@type": "Brand", name: t.site.name },
          offers: {
            "@type": "Offer",
            price: program.priceInr,
            priceCurrency: "INR",
            url: `${env.NEXT_PUBLIC_SITE_URL}${localePath(lang, path)}`,
          },
        }}
      />
    </>
  );
}
