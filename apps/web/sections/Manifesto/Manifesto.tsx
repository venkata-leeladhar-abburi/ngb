import { Heading, StudioBackdrop, Text } from "@ngb/ui";

import { getPageContent } from "@/content/lang";

import { ManifestoReveal } from "./ManifestoReveal";

/**
 * Manifesto (home.md §4, screen A2): the page's only centred section. Names the enemy in one poster
 * line, then two plain lines and the Tenglish line. On desktop the lines reveal as you scroll
 * (ManifestoReveal, GSAP); everywhere else, and with reduced motion, they are simply there.
 */
export async function Manifesto() {
  const { t } = await getPageContent();
  const manifesto = t.home.manifesto;

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      aria-labelledby="manifesto-title"
      className="border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <ManifestoReveal className="mx-auto flex max-w-(--container-content) flex-col items-center gap-24 text-center">
        <Heading as="h2" id="manifesto-title" variant="hero" data-reveal-line="">
          {manifesto.line1}
        </Heading>
        <div className="flex max-w-(--container-lead) flex-col gap-8">
          <Text variant="lead" data-reveal-line="">
            {manifesto.line2}
          </Text>
          <Text variant="lead" data-reveal-line="">
            {manifesto.line3}
          </Text>
        </div>
        <Text tone="muted" data-reveal-line="">
          {manifesto.tenglish}
        </Text>
      </ManifestoReveal>
    </StudioBackdrop>
  );
}
