import {
  Button,
  Link,
  PhotoPlaceholder,
  PriceOption,
  SectionTitle,
  StudioBackdrop,
  Text,
  perDayPrice,
} from "@ngb/ui";
import NextLink from "next/link";

import type { Program } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { formatInr } from "@/lib/format";

import { programCopy } from "./programCopy";

/** The phone buy bar hides while the hero, with its own button, is on screen. */
export const PROGRAM_HERO_ID = "program";

/**
 * Program hero (pages.md: Program detail, screen B2): breadcrumb, the program name, its promise, the
 * price with the per-day price, the one buy button and the trust line, beside a photo placeholder.
 * The price is [CONFIRM]; checkout reads its own from the server.
 */
export async function ProgramHero({ program }: { program: Program }) {
  const { lang, t } = await getPageContent();
  const detail = t.programDetail;
  const copy = programCopy(t, program.slug);

  return (
    <StudioBackdrop
      as="section"
      id={PROGRAM_HERO_ID}
      aria-labelledby="program-title"
      className="px-page pt-32 pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-32">
        <nav aria-label={detail.breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-8">
            <li>
              <Link as={NextLink} href={localePath(lang, "/programs")}>
                {t.site.nav.programs}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{program.name}</li>
          </ol>
        </nav>
        <div className="grid gap-48 lg:grid-cols-12 lg:items-start lg:gap-24">
          <div className="flex flex-col items-start gap-32 lg:col-span-7">
            <div className="flex flex-col gap-16">
              <SectionTitle as="h1" id="program-title">
                {program.name}
              </SectionTitle>
              <Text variant="lead" className="max-w-(--container-lead)">
                {copy.sub}
              </Text>
            </div>
            <PriceOption
              priceInr={program.priceInr}
              period={detail.once}
              note={detail.priceNote.replace(
                "{perDay}",
                formatInr(perDayPrice(program.priceInr, program.weeks)),
              )}
            />
            <div className="flex flex-col items-start gap-16">
              <Button
                as={NextLink}
                href={localePath(lang, `/checkout/${program.slug}`)}
                variant="onRed"
              >
                {t.site.buy}
              </Button>
              <Text>{detail.trust}</Text>
            </div>
          </div>
          <PhotoPlaceholder
            label={detail.photo}
            className="aspect-4/5 w-full lg:col-span-4 lg:col-start-9"
          />
        </div>
      </div>
    </StudioBackdrop>
  );
}
