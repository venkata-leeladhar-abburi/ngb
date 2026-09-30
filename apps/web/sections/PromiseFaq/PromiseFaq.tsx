import {
  FaqAccordion,
  LeanFrame,
  Link,
  PhotoPlaceholder,
  SectionTitle,
  StudioBackdrop,
  Text,
} from "@ngb/ui";
import NextLink from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/**
 * My promise + quick answers (home.md §10, screen A6): Nawin's first-person promise with his photo and
 * signature on the left, five answers on the right, then "All questions". The photo leans in a frame
 * (circles are only for play buttons); photo and signature are placeholders until the shoot.
 * Refund days are [CONFIRM].
 */
export async function PromiseFaq() {
  const { lang, t } = await getPageContent();
  const promise = t.home.promise;

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      aria-labelledby="promise-title"
      className="border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto grid max-w-(--container-content) gap-48 lg:grid-cols-12 lg:gap-24">
        <div className="flex flex-col gap-32 lg:col-span-5">
          <SectionTitle id="promise-title">{promise.headline}</SectionTitle>
          <Text variant="lead" className="max-w-(--container-lead)">
            {promise.body}
          </Text>
          <div className="flex items-center gap-24">
            <LeanFrame className="aspect-square w-(--spacing-144) shrink-0 border border-subtle bg-card">
              <PhotoPlaceholder lean decorative label={promise.photo} className="size-full" />
            </LeanFrame>
            <PhotoPlaceholder label={promise.signature} className="h-(--spacing-96) grow" />
          </div>
        </div>
        <div className="flex flex-col gap-24 lg:col-span-6 lg:col-start-7">
          <FaqAccordion items={promise.faq} defaultOpen={0} headingLevel="h3" />
          <Link
            as={NextLink}
            href={localePath(lang, "/faq")}
            variant="standalone"
            className="self-start"
          >
            {promise.allQuestions}
          </Link>
        </div>
      </div>
    </StudioBackdrop>
  );
}
