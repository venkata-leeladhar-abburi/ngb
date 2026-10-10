import {
  Button,
  Heading,
  LeanFrame,
  Link,
  PhotoPlaceholder,
  StudioBackdrop,
  Wordmark,
} from "@ngb/ui";
import NextLink from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/**
 * Instagram landing (pages.md: Instagram landing): one screen on a phone, Nawin's photo and three
 * stacked choices. No site header: a bio-link visitor picks in one tap. The Telugu line shows on the
 * English page only and is [TE REVIEW].
 */
export async function StartChoices() {
  const { lang, t } = await getPageContent();
  const start = t.start;
  const href = (to: `/${string}`) => localePath(lang, to);

  return (
    <StudioBackdrop className="flex min-h-dvh flex-col px-page py-24">
      <div className="mx-auto flex w-full max-w-(--container-lead) grow flex-col gap-24">
        <NextLink href={href("/")} aria-label={t.site.homeLabel} className="self-start">
          <Wordmark tone="red" size="sm" />
        </NextLink>
        <LeanFrame className="mx-32 min-h-(--spacing-144) grow border border-subtle bg-card">
          <PhotoPlaceholder lean label={start.photo} className="size-full" />
        </LeanFrame>
        <Heading as="h1" variant="h1" className="text-balance">
          {start.headline}
        </Heading>
        <div className="flex flex-col gap-12">
          <Button as={NextLink} href={href("/quiz")} variant="onRed" className="w-full">
            {start.find} ({start.findNote})
          </Button>
          <Button
            as={NextLink}
            href={href("/tools")}
            variant="secondary"
            ground="red"
            className="w-full"
          >
            {t.site.free}
          </Button>
          <Button
            as={NextLink}
            href={href("/programs")}
            variant="secondary"
            ground="red"
            className="w-full"
          >
            {start.programs}
          </Button>
        </div>
        {lang === "en" && (
          <Link
            as={NextLink}
            href={localePath("te", "/start")}
            hrefLang="te"
            lang="te-Latn"
            className="inline-flex min-h-target items-center self-start"
          >
            {start.telugu}
            <span aria-hidden="true">
              {" → "}
              <span lang="te">తె</span>
            </span>
          </Link>
        )}
      </div>
    </StudioBackdrop>
  );
}
