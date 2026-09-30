import { GoalTile, Link, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";
import NextLink from "next/link";

import { goalPrograms } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/**
 * Pick your goal (home.md §5, screen A3): four goal tiles, each one link to the program for that goal,
 * 2 x 2 on phones and 4 across from lg, then the quiz link for anyone unsure. On English pages the
 * Telugu line sits under the title; on /te the title is already Telugu.
 */
export async function GoalPicker() {
  const { lang, t } = await getPageContent();
  const goals = t.home.goals;

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      id="goals"
      aria-labelledby="goals-title"
      className="px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <div className="flex flex-col gap-8">
          <SectionTitle id="goals-title">{goals.headline}</SectionTitle>
          {lang === "en" && (
            <Text variant="lead" tone="muted" lang="te">
              {goals.telugu}
            </Text>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-x-16 gap-y-32 lg:grid-cols-4 lg:gap-24">
          {goals.tiles.map((tile, index) => {
            const program = goalPrograms[index] ?? "foundation-plan";
            return (
              <li key={program}>
                <GoalTile
                  href={localePath(lang, `/programs/${program}`)}
                  title={tile.title}
                  line={tile.line}
                  placeholderLabel={goals.photo}
                  linkAs={NextLink}
                />
              </li>
            );
          })}
        </ul>
        <Link
          as={NextLink}
          href={localePath(lang, "/quiz")}
          variant="standalone"
          className="self-start"
        >
          {goals.quiz}
        </Link>
      </div>
    </StudioBackdrop>
  );
}
