import {
  CalendarCheckIcon,
  CreditCardIcon,
  CrownIcon,
  ForkKnifeIcon,
  InfinityIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  UserIcon,
  VideoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import { Icon, LinkCard, ProgramCard, Reveal, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";
import NextLink from "next/link";

import { programs } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/** Anchor for "Start my plan" in the header, the hero and the phone sticky bar. */
export const PROGRAMS_ID = "programs";

/** Icons for "Every plan includes", in home.md §9 order. */
const INCLUDE_ICONS = [VideoIcon, ForkKnifeIcon, CalendarCheckIcon, WhatsappLogoIcon, InfinityIcon];
/** Icons for the trust line: refund, invoice, payment. */
const TRUST_ICONS = [ShieldCheckIcon, ReceiptIcon, CreditCardIcon];

/**
 * Programs (home.md §9, screen A5): the sale, on the red studio. Four program cards (the featured one
 * carries the screen's only glow and rises into place once), what every plan includes, the price
 * anchor, the trust line, and the two cross-sells (1:1 Coaching, the Club). Prices are [CONFIRM]
 * (catalog.ts); checkout reads its own prices from the server.
 */
export async function ProgramsGrid() {
  const { lang, t } = await getPageContent();
  const copy = t.home.programs;

  return (
    <StudioBackdrop
      as="section"
      id={PROGRAMS_ID}
      aria-labelledby="programs-title"
      className="px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48 lg:gap-64">
        <div className="flex flex-col gap-16">
          <SectionTitle id="programs-title" speedLines>
            {copy.headline}
          </SectionTitle>
          <Text variant="lead">{copy.sub}</Text>
        </div>
        <ul className="grid gap-24 md:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {programs.map((program) => {
            const card = (
              <ProgramCard
                name={program.name}
                line={copy.lines[program.slug]}
                weeks={program.weeks}
                priceInr={program.priceInr}
                featured={program.featured}
                {...(program.featured ? { tag: copy.popular } : {})}
                cta={{ href: localePath(lang, `/programs/${program.slug}`), label: t.site.buy }}
                weeksLabel={copy.weeks}
                perDayLabel={copy.perDay}
                linkAs={NextLink}
                className="h-full"
              />
            );
            return (
              <li key={program.slug} className="flex flex-col">
                {program.featured ? (
                  <Reveal effect="rise" className="h-full">
                    {card}
                  </Reveal>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-32">
          <ul
            aria-label={copy.includesLabel}
            className="grid grid-cols-2 gap-24 md:grid-cols-3 lg:grid-cols-5"
          >
            {copy.includes.map((item, index) => (
              <li key={index} className="flex flex-col items-center gap-12 text-center">
                <Icon icon={INCLUDE_ICONS[index] ?? VideoIcon} size="xl" />
                <Text as="span">{item}</Text>
              </li>
            ))}
          </ul>
          <Text variant="lead" className="text-center">
            {copy.anchor}
          </Text>
          <ul className="flex flex-wrap justify-center gap-x-32 gap-y-16">
            {copy.trust.map((item, index) => (
              <li key={index} className="flex items-center gap-12">
                <Icon icon={TRUST_ICONS[index] ?? ShieldCheckIcon} size="lg" />
                <Text as="span">{item}</Text>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-24 md:grid-cols-2">
          <LinkCard
            href={localePath(lang, "/coaching")}
            icon={UserIcon}
            title={copy.coaching.question}
            label={copy.coaching.label}
            linkAs={NextLink}
          />
          <LinkCard
            href={localePath(lang, "/club")}
            icon={CrownIcon}
            title={copy.club.question}
            label={copy.club.label}
            linkAs={NextLink}
          />
        </div>
      </div>
    </StudioBackdrop>
  );
}
