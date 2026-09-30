import { InstagramLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr";
import {
  Button,
  LeanFrame,
  Marquee,
  PhotoPlaceholder,
  SectionTitle,
  StudioBackdrop,
  Text,
} from "@ngb/ui";

import { social } from "@/content/catalog";
import { getPageContent } from "@/content/lang";

/** Eight post slots, as in screen A6, until real posts are collected. */
const POST_COUNT = 8;

/**
 * Community (home.md §11, screen A6): the page's one marquee of Instagram posts (pauses on hover, on
 * focus and with its own button; a still row with reduced motion), then the follow buttons. Posts are
 * decorative placeholders until collected. The WhatsApp channel button appears only once a real
 * channel link exists (catalog.ts).
 */
export async function CommunityMarquee() {
  const { t } = await getPageContent();
  const community = t.home.community;
  const posts = Array.from({ length: POST_COUNT }, (_, index) => (
    <LeanFrame
      key={index}
      className="aspect-3/5 w-(--spacing-144) border border-subtle bg-card lg:w-[calc(var(--spacing-96)*2)]"
    >
      <PhotoPlaceholder lean decorative label={community.post} className="size-full" />
    </LeanFrame>
  ));

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      aria-labelledby="community-title"
      className="overflow-hidden border-t border-subtle pt-section-top pb-section-bottom"
    >
      <div className="flex flex-col gap-48">
        <div className="px-page">
          <div className="mx-auto flex max-w-(--container-content) flex-col gap-16">
            <SectionTitle id="community-title">{community.headline}</SectionTitle>
            <Text variant="lead" tone="muted">
              {community.sub}
            </Text>
          </div>
        </div>
        <Marquee
          label={community.marqueeLabel}
          items={posts}
          pauseLabel={community.pause}
          playLabel={community.play}
        />
        <div className="px-page">
          <div className="mx-auto flex max-w-(--container-content) flex-wrap gap-16">
            <Button as="a" href={social.instagram} variant="secondary" icon={InstagramLogoIcon}>
              {community.follow.instagram}
            </Button>
            <Button as="a" href={social.youtube} variant="secondary" icon={YoutubeLogoIcon}>
              {community.follow.youtube}
            </Button>
          </div>
        </div>
      </div>
    </StudioBackdrop>
  );
}
