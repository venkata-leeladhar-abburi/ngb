import { PhotoPlaceholder, SectionTitle, StudioBackdrop } from "@ngb/ui";

import { getPageContent } from "@/content/lang";

/**
 * About hero (pages.md: About): Nawin introduces himself by his own name, beside his portrait.
 * The photo is a labelled placeholder until the shoot.
 */
export async function AboutHero() {
  const { t } = await getPageContent();
  const about = t.about;

  return (
    <StudioBackdrop variant="night" className="px-page pt-64 pb-section-bottom">
      <div className="mx-auto grid max-w-(--container-content) gap-48 lg:grid-cols-12 lg:items-start lg:gap-24">
        <SectionTitle as="h1" className="lg:col-span-7">
          {about.headline}
        </SectionTitle>
        <PhotoPlaceholder
          label={about.photo}
          className="aspect-4/5 w-full lg:col-span-4 lg:col-start-9"
        />
      </div>
    </StudioBackdrop>
  );
}
