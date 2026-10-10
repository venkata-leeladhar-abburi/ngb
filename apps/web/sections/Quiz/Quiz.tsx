import { StudioBackdrop } from "@ngb/ui";

import { programs } from "@/content/catalog";
import { getPageContent } from "@/content/lang";

import { PAGE_TITLE_ID } from "../PageHeader";
import { PlanCard } from "../ProgramsGrid";

import { QuizFlow } from "./QuizFlow";

/** The quiz under its page title. "Get the free 7-day starter first" arrives with lead capture (Phase 7). */
export async function Quiz() {
  const { lang, t } = await getPageContent();
  return (
    <StudioBackdrop
      as="section"
      variant="night"
      aria-labelledby={PAGE_TITLE_ID}
      className="px-page pb-section-bottom"
    >
      <div className="mx-auto max-w-(--container-content)">
        <QuizFlow
          copy={t.quiz}
          programs={Object.fromEntries(
            programs.map((program) => [
              program.slug,
              {
                name: program.name,
                card: <PlanCard program={program} lang={lang} t={t} headingLevel="h3" />,
              },
            ]),
          )}
        />
      </div>
    </StudioBackdrop>
  );
}
