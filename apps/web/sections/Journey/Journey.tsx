import {
  Heading,
  LeanFrame,
  PhotoPlaceholder,
  QuoteCard,
  SectionTitle,
  StudioBackdrop,
  SwipeRow,
  Text,
} from "@ngb/ui";

import { getPageContent } from "@/content/lang";

import { JourneyPan } from "./JourneyPan";
import { StoryLink } from "./StoryLink";

interface JourneyCardProps {
  title: string;
  line: string;
  photo: string;
}

/** One step of the story: a leaning archive photo, the step and one line. */
function JourneyCard({ title, line, photo }: JourneyCardProps) {
  return (
    <div className="flex flex-col gap-16">
      <LeanFrame className="aspect-1/2 w-full border border-subtle bg-card">
        <PhotoPlaceholder lean label={photo} className="size-full" />
      </LeanFrame>
      <div className="flex flex-col gap-8">
        <Heading as="h3" variant="h3">
          {title}
        </Heading>
        <Text tone="muted">{line}</Text>
      </div>
    </div>
  );
}

/**
 * The journey (home.md §3, screen A2): five leaning photo cards from 2022 to today, then the Tenglish
 * quote and the story link. From 1024 px the row pans in sideways while pinned (JourneyPan, GSAP);
 * below that it is a swipe row. Reduced motion: the row simply sits in place.
 */
export async function Journey() {
  const { t } = await getPageContent();
  const journey = t.home.journey;
  const cards = journey.cards.map((card) => (
    <JourneyCard key={card.title} {...card} photo={journey.photo} />
  ));

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      id="journey"
      aria-labelledby="journey-title"
      className="overflow-hidden px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48 lg:gap-64">
        <SectionTitle id="journey-title">{journey.headline}</SectionTitle>
        <JourneyPan>
          <ol aria-label={journey.rowLabel} className="hidden grid-cols-5 gap-24 lg:grid">
            {cards.map((card, index) => (
              <li key={index} data-pan="">
                {card}
              </li>
            ))}
          </ol>
        </JourneyPan>
        <SwipeRow
          label={journey.rowLabel}
          items={cards}
          itemClassName="w-3/5 md:w-1/3"
          className="-mx-page lg:hidden"
        />
        <div className="flex flex-col items-start gap-16">
          <QuoteCard quote={journey.quoteTenglish} by={journey.quote} />
          <StoryLink
            label={journey.link}
            title={journey.storyTitle}
            pending={journey.storyPending}
            closeLabel={t.site.close}
          />
        </div>
      </div>
    </StudioBackdrop>
  );
}
