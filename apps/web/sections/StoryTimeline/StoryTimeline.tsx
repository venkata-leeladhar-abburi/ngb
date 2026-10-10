import { Heading, StudioBackdrop, Text, VisuallyHidden } from "@ngb/ui";

import { getPageContent } from "@/content/lang";

/**
 * Nawin's story in five parts (pages.md: About), an ordered list of rows so each body keeps a
 * readable line length. Only the part titles are written and they are [CONFIRM]; each body is a
 * visible TODO(copy) until Nawin's own words arrive.
 */
export async function StoryTimeline() {
  const { t } = await getPageContent();
  const about = t.about;

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      aria-labelledby="story-title"
      className="border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto max-w-(--container-content)">
        <VisuallyHidden as="h2" id="story-title">
          {about.storyLabel}
        </VisuallyHidden>
        <ol className="flex flex-col">
          {about.story.map((title, index) => (
            <li
              key={index}
              className="grid gap-x-24 gap-y-8 border-t border-strong py-32 lg:grid-cols-12"
            >
              <Text
                as="span"
                variant="readout"
                tone="accent"
                aria-hidden="true"
                className="lg:col-span-1"
              >
                {String(index + 1).padStart(2, "0")}
              </Text>
              <Heading as="h3" variant="h3" className="lg:col-span-4">
                {title}
              </Heading>
              <Text tone="muted" className="max-w-(--container-measure) lg:col-span-7">
                {about.storyBody}
              </Text>
            </li>
          ))}
        </ol>
      </div>
    </StudioBackdrop>
  );
}
