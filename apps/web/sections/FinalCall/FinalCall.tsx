import { Button, EmberSurface, Heading, Link, PhotoPlaceholder, Reveal, Text } from "@ngb/ui";
import NextLink from "next/link";

import { getPageContent } from "@/content/lang";

import { PROGRAMS_ID } from "../ProgramsGrid";
import { TOOLS_ID } from "../ToolsBento";

/**
 * Final call (home.md §12, screen A7): one left-aligned poster line, the Telugu line on English pages,
 * one button and the soft free-tools link, with Nawin cropped at the right edge. The red glow rises
 * from the bottom (EmberSurface glow, the screen's only glow) and the button breathes once when seen.
 */
export async function FinalCall() {
  const { lang, t } = await getPageContent();
  const finalCall = t.home.finalCall;

  return (
    <EmberSurface
      as="section"
      variant="glow"
      aria-labelledby="final-call-title"
      className="px-page pt-section-top pb-section-bottom text-primary"
    >
      <div className="relative mx-auto grid max-w-(--container-content) gap-48 lg:grid-cols-12 lg:items-center">
        <div className="relative flex flex-col items-start gap-32 lg:col-span-7">
          <div className="flex flex-col gap-16">
            <Heading as="h2" id="final-call-title" variant="display" className="text-balance">
              {finalCall.headline}
            </Heading>
            {lang === "en" && (
              <Text variant="lead" lang="te">
                {finalCall.telugu}
              </Text>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-24 gap-y-16">
            <Reveal effect="breathe">
              <Button as={NextLink} href={`#${PROGRAMS_ID}`}>
                {t.site.buy}
              </Button>
            </Reveal>
            <Text>
              {finalCall.notReady}{" "}
              <Link as={NextLink} href={`#${TOOLS_ID}`}>
                {t.site.free}
              </Link>
            </Text>
          </div>
        </div>
        <PhotoPlaceholder label={finalCall.photo} className="aspect-4/5 w-full lg:col-span-5" />
      </div>
    </EmberSurface>
  );
}
