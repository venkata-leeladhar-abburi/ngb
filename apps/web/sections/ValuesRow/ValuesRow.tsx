import { Button, Heading, StudioBackdrop, VisuallyHidden } from "@ngb/ui";
import NextLink from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/** The id the phone sticky bar hides over: this section carries "Start my plan" itself. */
export const VALUES_ID = "values";

/**
 * What Nawin stands for (pages.md: About), the page's closing section on the red studio: four poster
 * lines of four words or fewer, then the page's one buying action.
 */
export async function ValuesRow() {
  const { lang, t } = await getPageContent();
  const about = t.about;

  return (
    <StudioBackdrop
      as="section"
      id={VALUES_ID}
      aria-labelledby="values-title"
      className="px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col items-start gap-64">
        <VisuallyHidden as="h2" id="values-title">
          {about.valuesLabel}
        </VisuallyHidden>
        <ul className="grid w-full gap-x-24 gap-y-48 md:grid-cols-2">
          {about.values.map((value, index) => (
            <li key={index}>
              <Heading as="h3" variant="display" className="text-balance">
                {value}
              </Heading>
            </li>
          ))}
        </ul>
        <Button as={NextLink} href={localePath(lang, "/programs")} variant="onRed">
          {t.site.buy}
        </Button>
      </div>
    </StudioBackdrop>
  );
}
