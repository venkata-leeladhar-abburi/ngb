import { SectionTitle, StudioBackdrop, Text } from "@ngb/ui";

interface PageHeaderProps {
  /** The page's h1. */
  title: string;
  /** One lead line under it. */
  sub?: string;
}

/** The id the page's h1 carries, for `aria-labelledby` on the section that follows it. */
export const PAGE_TITLE_ID = "page-title";

/**
 * Inner-page header on the night ground: the page title with the red slash and one lead line
 * (pages.md). The red studio header is kept for the programs page (ProgramsHeader).
 */
export function PageHeader({ title, sub }: PageHeaderProps) {
  return (
    <StudioBackdrop variant="night" className="px-page pt-64 pb-48">
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-16">
        <SectionTitle as="h1" id={PAGE_TITLE_ID}>
          {title}
        </SectionTitle>
        {sub && (
          <Text variant="lead" tone="muted" className="max-w-(--container-lead)">
            {sub}
          </Text>
        )}
      </div>
    </StudioBackdrop>
  );
}
