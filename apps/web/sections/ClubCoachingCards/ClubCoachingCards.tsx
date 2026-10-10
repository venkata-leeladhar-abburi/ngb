import { CrownIcon, UserIcon } from "@phosphor-icons/react/ssr";
import { LinkCard } from "@ngb/ui";
import NextLink from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

interface ClubCoachingCardsProps {
  /** Which card leads: coaching on the homepage (home.md §9), the Club on the programs page (pages.md). */
  first?: "coaching" | "club";
}

/**
 * The two cross-sells under the programs (home.md §9; pages.md: Programs, "Below the table"):
 * 1:1 Coaching and the Club. No prices here: both are [CONFIRM] and live on their own pages.
 */
export async function ClubCoachingCards({ first = "coaching" }: ClubCoachingCardsProps) {
  const { lang, t } = await getPageContent();
  const copy = t.home.programs;
  const coaching = (
    <LinkCard
      href={localePath(lang, "/coaching")}
      icon={UserIcon}
      title={copy.coaching.question}
      label={copy.coaching.label}
      linkAs={NextLink}
    />
  );
  const club = (
    <LinkCard
      href={localePath(lang, "/club")}
      icon={CrownIcon}
      title={copy.club.question}
      label={copy.club.label}
      linkAs={NextLink}
    />
  );
  return (
    <div className="grid gap-24 md:grid-cols-2">
      {first === "club" ? club : coaching}
      {first === "club" ? coaching : club}
    </div>
  );
}
