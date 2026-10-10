import { SectionTitle, StudioBackdrop, VideoCard } from "@ngb/ui";
import NextLink from "next/link";

import { muscleGroups } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

import { GroupFilter } from "./GroupFilter";

/** pages.md: "3 free videos for every muscle group". */
const FREE_PER_GROUP = 3;

/**
 * Free workouts library (pages.md: Free workouts, screen C1): chips for the muscle groups, then three
 * free videos per group. No videos exist yet, so every free card is a labelled placeholder and not a
 * link; only "Chest at home" and the locked chest plan are named in the docs. The player and
 * the locked-card event arrive with the videos (Phase 7).
 */
export async function VideoLibrary() {
  const { lang, t } = await getPageContent();
  const home = t.home.workouts;
  const page = t.workoutsPage;

  const groups = muscleGroups.map((id, index) => {
    const label = home.groups[index] ?? id;
    const isChest = id === "chest";
    return {
      id,
      label,
      content: (
        <section
          id={id}
          aria-labelledby={`${id}-title`}
          className="flex scroll-mt-24 flex-col gap-24"
        >
          <SectionTitle id={`${id}-title`}>{label}</SectionTitle>
          <ul
            className={`grid gap-24 md:grid-cols-2 ${isChest ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {Array.from({ length: FREE_PER_GROUP }, (_, video) => {
              const named = isChest && video === 0;
              return (
                <li key={video}>
                  <VideoCard
                    title={named ? home.featured.title : page.videoTitle}
                    meta={named ? home.featured.meta : page.videoMeta}
                    placeholderLabel={named ? home.featured.photo : page.photo}
                    linkAs={NextLink}
                  />
                </li>
              );
            })}
            {isChest && (
              <li>
                <VideoCard
                  locked
                  href={localePath(lang, "/programs/mass-builder")}
                  title={home.locked.title}
                  lockedLabel={home.locked.label}
                  lockedPrefix={home.lockedPrefix}
                  placeholderLabel={home.locked.photo}
                  linkAs={NextLink}
                />
              </li>
            )}
          </ul>
        </section>
      ),
    };
  });

  return (
    <StudioBackdrop variant="night" className="px-page pb-section-bottom">
      <div className="mx-auto max-w-(--container-content)">
        <GroupFilter
          label={home.groupsLabel}
          allLabel={t.home.transformations.filters.all}
          groups={groups}
        />
      </div>
    </StudioBackdrop>
  );
}
