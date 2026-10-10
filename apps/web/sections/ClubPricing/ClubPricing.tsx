import { Button, PriceOption, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";
import NextLink from "next/link";

import { club } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/**
 * NGB Evolve Club (pages.md: NGB Evolve Club, screen C2): what the membership is, the monthly and
 * yearly prices and one button. The button says "Join the Club", as pages.md has it, not "Start my
 * plan" (a membership, not a program). Prices are [CONFIRM]; checkout is Phase 7.
 */
export async function ClubPricing() {
  const { lang, t } = await getPageContent();
  const copy = t.club;

  return (
    <StudioBackdrop
      as="section"
      aria-labelledby="club-title"
      className="px-page pt-64 pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col items-start gap-48">
        <div className="flex flex-col gap-16">
          <SectionTitle as="h1" id="club-title">
            {copy.headline}
          </SectionTitle>
          <Text variant="lead" className="max-w-(--container-lead)">
            {copy.sub}
          </Text>
        </div>
        <ul aria-label={copy.pricesLabel} className="flex flex-col gap-32 md:flex-row md:gap-64">
          <li>
            <PriceOption priceInr={club.monthlyInr} period={copy.month} />
          </li>
          <li>
            <PriceOption priceInr={club.yearlyInr} period={copy.year} note={copy.save} />
          </li>
        </ul>
        <div className="flex flex-col items-start gap-16">
          <Button as={NextLink} href={localePath(lang, "/checkout/club")} variant="onRed">
            {t.home.programs.club.label}
          </Button>
          <Text>{copy.cancel}</Text>
        </div>
      </div>
    </StudioBackdrop>
  );
}
