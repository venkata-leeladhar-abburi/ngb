import { FaqAccordion, Link, SectionTitle, StudioBackdrop } from "@ngb/ui";

import { getPageContent } from "@/content/lang";

/** The five groups, in pages.md order. Links jump to `#<id>-title`. */
export const FAQ_GROUPS = ["programs", "food", "training", "payments", "account"] as const;

/**
 * Full FAQ (pages.md: Full FAQ): links to the five groups, then each group's questions in an
 * accordion. The links are plain anchors, so they work with the keyboard and without JavaScript.
 * The refund answer is [CONFIRM].
 */
export async function FaqGroups() {
  const { t } = await getPageContent();
  const faq = t.faq;

  return (
    <StudioBackdrop variant="night" className="px-page pb-section-bottom">
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-64">
        <nav aria-label={faq.navLabel}>
          <ul className="flex flex-wrap gap-x-32 gap-y-8">
            {FAQ_GROUPS.map((id) => (
              <li key={id}>
                <Link href={`#${id}-title`} variant="standalone">
                  {faq.groups[id].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {FAQ_GROUPS.map((id) => (
          <section
            key={id}
            aria-labelledby={`${id}-title`}
            className="grid gap-24 lg:grid-cols-12 lg:items-start"
          >
            {/* Focusable by script only, so a group link moves focus (and a screen reader) to its title. */}
            <SectionTitle id={`${id}-title`} tabIndex={-1} className="scroll-mt-24 lg:col-span-4">
              {faq.groups[id].title}
            </SectionTitle>
            <FaqAccordion
              items={faq.groups[id].items}
              headingLevel="h3"
              className="lg:col-span-8"
            />
          </section>
        ))}
      </div>
    </StudioBackdrop>
  );
}
