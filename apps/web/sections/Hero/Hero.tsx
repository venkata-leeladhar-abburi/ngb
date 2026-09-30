import {
  Button,
  Heading,
  HeartbeatLine,
  PhotoPlaceholder,
  PosterWord,
  StudioBackdrop,
  Text,
} from "@ngb/ui";
import Link from "next/link";

import { getPageContent } from "@/content/lang";

import { HeroPlay } from "./HeroPlay";

/** Anchor the phone sticky bar watches: it appears once the hero has scrolled away. */
export const HERO_ID = "hero";

/**
 * Hero (home.md §1, screen A1): Nawin on the red studio with EVOLVE behind him, and four text
 * elements bottom-left (eyebrow, headline, sub, two buttons). The photo is a placeholder until the shoot.
 */
export async function Hero() {
  const { t } = await getPageContent();
  const hero = t.home.hero;
  const [, eyebrowMark, eyebrowText] = /^(\/\/ )?(.*)$/s.exec(hero.eyebrow) ?? [];

  return (
    <StudioBackdrop
      as="section"
      id={HERO_ID}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden px-page"
    >
      <PosterWord animate className="absolute inset-x-0 top-24 px-page lg:top-48">
        Evolve
      </PosterWord>
      <div className="relative mx-auto grid min-h-[calc(100dvh-var(--spacing-nav))] max-w-(--container-content) items-end gap-24 pt-96 pb-64 lg:grid-cols-2 lg:gap-32">
        {/* Photo first in the DOM, so on phones (where it sits on top) focus reaches its play button
            first; from lg it moves to the right column. */}
        <div className="relative aspect-4/3 w-full max-w-(--container-lead) justify-self-center lg:order-last lg:aspect-auto lg:h-full lg:justify-self-end">
          <PhotoPlaceholder label={hero.photo} className="size-full" />
          <div className="absolute top-1/4 right-24">
            <HeroPlay
              label={hero.play}
              title={hero.clipTitle}
              pending={hero.clipPending}
              closeLabel={t.site.close}
            />
          </div>
        </div>
        <div className="relative flex flex-col gap-24 lg:pb-48">
          <Text variant="label">
            {/* The slashes are decoration: screen readers would read "slash slash". */}
            {eyebrowMark && <span aria-hidden="true">{eyebrowMark}</span>}
            {eyebrowText}
          </Text>
          <Heading as="h1" id="hero-title" variant="h1" className="text-balance">
            {hero.headline}
          </Heading>
          <Text variant="lead" className="max-w-(--container-lead)">
            {hero.sub}
          </Text>
          <div className="flex flex-wrap gap-16">
            <Button as={Link} href="#programs" variant="onRed">
              {t.site.buy}
            </Button>
            <Button as={Link} href="#tools" variant="secondary" ground="red">
              {t.site.free}
            </Button>
          </div>
        </div>
      </div>
      <HeartbeatLine className="absolute inset-x-0 bottom-32" />
    </StudioBackdrop>
  );
}
