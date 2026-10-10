import { PriceOption, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";

import { coaching } from "@/content/catalog";
import { getPageContent } from "@/content/lang";
import { QUIZ } from "@/lib/quiz";

import { CoachingForm } from "./CoachingForm";

/**
 * 1:1 Coaching (pages.md: 1:1 Coaching, screen C2): the offer, its price and the application form.
 * The form is shown but switched off: it has nowhere to post until lead capture exists (Phase 7), so
 * the whole fieldset is disabled and a line says so. Nothing typed here is sent or stored.
 * The price is [CONFIRM]; "limited seats each month" is [REAL DATA] and is left out until it is true.
 */
export async function CoachingApply() {
  const { t } = await getPageContent();
  const copy = t.coaching;
  const goals = t.quiz.questions.goal.answers;
  const levels = t.quiz.questions.level.answers;

  return (
    <StudioBackdrop variant="night" className="px-page pt-64 pb-section-bottom">
      <div className="mx-auto grid max-w-(--container-content) gap-48 lg:grid-cols-12 lg:items-start lg:gap-24">
        <div className="flex flex-col gap-32 lg:col-span-5">
          <div className="flex flex-col gap-16">
            <SectionTitle as="h1">{copy.headline}</SectionTitle>
            <Text variant="lead" tone="muted" className="max-w-(--container-lead)">
              {copy.sub}
            </Text>
          </div>
          <PriceOption priceInr={coaching.priceInr} period={copy.period} />
        </div>
        <CoachingForm
          copy={copy}
          goals={QUIZ.goal.map((value) => ({ value, label: goals[value] }))}
          levels={QUIZ.level.map((value) => ({ value, label: levels[value] }))}
        />
      </div>
    </StudioBackdrop>
  );
}
