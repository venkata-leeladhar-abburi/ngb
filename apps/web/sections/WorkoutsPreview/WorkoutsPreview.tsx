import { LinkList, SectionTitle, StudioBackdrop, Text, VideoCard } from "@ngb/ui";
import NextLink from "next/link";

import { muscleGroups } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/**
 * Free workouts (home.md §7, screen A4): the featured free video on the left; the muscle groups and the
 * locked full plan on the right (stacked under the video on phones). Groups link to the workouts page;
 * the locked card links to the program that holds it. Thumbnails are placeholders until the videos exist.
 */
export async function WorkoutsPreview() {
  const { lang, t } = await getPageContent();
  const workouts = t.home.workouts;
  const groupHref = (group: string) => `${localePath(lang, "/workouts")}#${group}`;
  const items = muscleGroups.map((group, index) => ({
    href: groupHref(group),
    label: workouts.groups[index] ?? group,
    meta: workouts.freeCount,
  }));

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      id="workouts"
      aria-labelledby="workouts-title"
      className="border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <div className="flex flex-col gap-16">
          <SectionTitle id="workouts-title">{workouts.headline}</SectionTitle>
          <Text variant="lead" tone="muted" className="max-w-(--container-lead)">
            {workouts.sub}
          </Text>
        </div>
        <div className="grid gap-24 lg:grid-cols-12">
          <VideoCard
            href={groupHref("chest")}
            title={workouts.featured.title}
            meta={workouts.featured.meta}
            placeholderLabel={workouts.featured.photo}
            linkAs={NextLink}
            className="lg:col-span-8"
          />
          <div className="flex flex-col gap-24 lg:col-span-4">
            <LinkList
              label={workouts.groupsLabel}
              items={items}
              current={groupHref("chest")}
              linkAs={NextLink}
            />
            <VideoCard
              locked
              href={localePath(lang, "/programs/mass-builder")}
              title={workouts.locked.title}
              lockedLabel={workouts.locked.label}
              lockedPrefix={workouts.lockedPrefix}
              placeholderLabel={workouts.locked.photo}
              linkAs={NextLink}
            />
          </div>
        </div>
      </div>
    </StudioBackdrop>
  );
}
