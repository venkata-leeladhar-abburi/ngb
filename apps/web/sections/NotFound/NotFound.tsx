import { Button, Heading, StudioBackdrop, Text } from "@ngb/ui";
import NextLink from "next/link";

export interface NotFoundCopy {
  headline: string;
  sub: string;
  home: { href: string; label: string };
  tools: { href: string; label: string };
}

/**
 * 404 (pages.md: 404): the headline, one line and two ways back. Copy comes in as props, not from
 * the URL: the global 404 renders outside the `[lang]` layout.
 */
export function NotFound({ headline, sub, home, tools }: NotFoundCopy) {
  return (
    <StudioBackdrop variant="night" className="px-page pt-section-top pb-section-bottom">
      <div className="mx-auto flex max-w-(--container-content) flex-col items-start gap-32">
        <div className="flex flex-col gap-16">
          <Heading as="h1" variant="display" className="text-balance">
            {headline}
          </Heading>
          <Text variant="lead" tone="muted">
            {sub}
          </Text>
        </div>
        <div className="flex flex-wrap gap-16">
          <Button as={NextLink} href={home.href}>
            {home.label}
          </Button>
          <Button as={NextLink} href={tools.href} variant="secondary">
            {tools.label}
          </Button>
        </div>
      </div>
    </StudioBackdrop>
  );
}
