import { getPageContent } from "@/content/lang";
import { HERO_ID, Hero } from "@/sections/Hero";
import { Journey } from "@/sections/Journey";
import { Manifesto } from "@/sections/Manifesto";
import { ProofStrip } from "@/sections/ProofStrip";
import { SiteHeader } from "@/sections/SiteHeader";
import { StickyActions } from "@/sections/StickyActions";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

/** The homepage (home.md): one story in 12 beats. Sections are added screen by screen (A1 to A7). */
export default async function HomePage() {
  const { t } = await getPageContent();
  return (
    <>
      <SiteHeader path="/" />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Journey />
        <Manifesto />
      </main>
      <StickyActions
        watchId={HERO_ID}
        label={t.site.stickyLabel}
        buy={{ href: "#programs", label: t.site.buy }}
        free={{ href: "#tools", label: t.site.free }}
      />
    </>
  );
}
