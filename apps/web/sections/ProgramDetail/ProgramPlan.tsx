import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import { Heading, Icon, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";

import type { Program } from "@/content/catalog";
import { getPageContent } from "@/content/lang";

import { programCopy } from "./programCopy";

/**
 * What the program is (pages.md: Program detail, screens B2 and B3): who it is for and not for, the
 * schedule and food angle, the phases, a hostel day of food and what is inside. Only Mass Builder has
 * every part written; a part with no copy shows a visible TODO(copy). The hostel dinner and the
 * counts in "What's inside" are [CONFIRM].
 */
export async function ProgramPlan({ program }: { program: Program }) {
  const { t } = await getPageContent();
  const detail = t.programDetail;
  const copy = programCopy(t, program.slug);
  const missing = <Text tone="muted">{detail.missing}</Text>;

  return (
    <StudioBackdrop variant="night" className="px-page pt-section-top pb-section-bottom">
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-64">
        <section aria-labelledby="for-you-title" className="grid gap-48 lg:grid-cols-12 lg:gap-24">
          <div className="flex flex-col gap-16 lg:col-span-6">
            <SectionTitle id="for-you-title">{detail.forYouTitle}</SectionTitle>
            <Text variant="lead" className="max-w-(--container-lead)">
              {copy.forYou}
            </Text>
            <dl className="flex flex-col gap-8">
              <div className="flex flex-wrap gap-x-12">
                <Text as="dt" variant="label" tone="muted">
                  {detail.scheduleLabel}
                </Text>
                <Text as="dd" variant="data">
                  {copy.schedule}
                </Text>
              </div>
              <div className="flex flex-wrap gap-x-12">
                <Text as="dt" variant="label" tone="muted">
                  {detail.foodLabel}
                </Text>
                <Text as="dd">{copy.food}</Text>
              </div>
            </dl>
          </div>
          <div className="flex flex-col gap-16 lg:col-span-5 lg:col-start-8">
            <Heading as="h3" variant="h2">
              {detail.notForYouTitle}
            </Heading>
            {copy.notForYou ? <Text>{copy.notForYou}</Text> : missing}
          </div>
        </section>

        <section aria-labelledby="phases-title" className="flex flex-col gap-32">
          <SectionTitle id="phases-title">{detail.phasesTitle}</SectionTitle>
          {copy.phases.length > 0 ? (
            <ol className="grid gap-24 lg:grid-cols-3">
              {copy.phases.map((phase, index) => (
                <li key={index} className="flex flex-col gap-12 border-t border-strong pt-16">
                  <Text as="span" variant="readout" tone="accent" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Heading as="h3" variant="h3">
                    {phase.title}
                  </Heading>
                  <Text tone="muted">{phase.line}</Text>
                </li>
              ))}
            </ol>
          ) : (
            missing
          )}
        </section>

        <div className="grid gap-64 lg:grid-cols-12 lg:gap-24">
          <section aria-labelledby="hostel-title" className="flex flex-col gap-32 lg:col-span-6">
            <SectionTitle id="hostel-title">{detail.hostelTitle}</SectionTitle>
            {copy.hostelDay.length > 0 ? (
              <dl className="flex flex-col">
                {copy.hostelDay.map((item, index) => (
                  <div key={index} className="flex flex-col gap-4 border-t border-subtle py-16">
                    <Text as="dt" variant="label" tone="muted">
                      {item.meal}
                    </Text>
                    <Text as="dd">{item.food}</Text>
                  </div>
                ))}
              </dl>
            ) : (
              missing
            )}
          </section>
          <section
            aria-labelledby="inside-title"
            className="flex flex-col gap-32 lg:col-span-5 lg:col-start-8"
          >
            <SectionTitle id="inside-title">{detail.insideTitle}</SectionTitle>
            {copy.inside.length > 0 ? (
              <ul className="flex flex-col gap-16">
                {copy.inside.map((item, index) => (
                  <li key={index} className="flex items-start gap-12">
                    <Icon icon={CheckCircleIcon} size="lg" />
                    <Text as="span">{item}</Text>
                  </li>
                ))}
              </ul>
            ) : (
              missing
            )}
          </section>
        </div>
      </div>
    </StudioBackdrop>
  );
}
