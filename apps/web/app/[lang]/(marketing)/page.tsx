import { getPageContent } from "@/content/lang";
import { GoalPicker } from "@/sections/GoalPicker";
import { HERO_ID, Hero } from "@/sections/Hero";
import { Journey } from "@/sections/Journey";
import { Manifesto } from "@/sections/Manifesto";
import { PROGRAMS_ID, ProgramsGrid } from "@/sections/ProgramsGrid";
import { ProofStrip } from "@/sections/ProofStrip";
import { SiteHeader } from "@/sections/SiteHeader";
import { StickyActions } from "@/sections/StickyActions";
import { TOOLS_ID, ToolsBento } from "@/sections/ToolsBento";
import { TransformationsRow } from "@/sections/TransformationsRow";
import { WorkoutsPreview } from "@/sections/WorkoutsPreview";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

/** The phone bar hides over the hero and over the sections that make its offers themselves. */
const HIDE_STICKY_OVER = [HERO_ID, TOOLS_ID, PROGRAMS_ID];

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
        <GoalPicker />
        <ToolsBento />
        <WorkoutsPreview />
        <TransformationsRow />
        <ProgramsGrid />
      </main>
      <StickyActions
        hideOver={HIDE_STICKY_OVER}
        label={t.site.stickyLabel}
        buy={{ href: `#${PROGRAMS_ID}`, label: t.site.buy }}
        free={{ href: `#${TOOLS_ID}`, label: t.site.free }}
      />
    </>
  );
}
