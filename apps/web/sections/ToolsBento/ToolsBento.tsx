import { Button, SectionTitle, StudioBackdrop, Text, ToolCard } from "@ngb/ui";
import NextLink from "next/link";

import { smallTools, teluguPlateIcon } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

/** Anchor for "Try free tools" in the hero and the phone sticky bar. */
export const TOOLS_ID = "tools";

/**
 * Free tools (home.md §6, screen A3): a bento with the Telugu Plate counter as the one large tile and
 * seven small tool tiles, then "Try free tools" to the tools page. Every tile is one link; hover only.
 */
export async function ToolsBento() {
  const { lang, t } = await getPageContent();
  const tools = t.home.tools;
  const href = (slug: string) => localePath(lang, `/tools/${slug}`);
  // The first four small tiles sit beside the large one (2 x 2); the last three run in a row under it.
  const beside = smallTools.slice(0, 4);
  const below = smallTools.slice(4);

  const small = (tool: (typeof smallTools)[number], span: string) => (
    <li key={tool.slug} className={`flex ${span}`}>
      <ToolCard
        href={href(tool.slug)}
        icon={tool.icon}
        title={tools.small[tool.slug].title}
        line={tools.small[tool.slug].line}
        linkAs={NextLink}
        className="w-full"
      />
    </li>
  );

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      id={TOOLS_ID}
      aria-labelledby="tools-title"
      className="border-t border-subtle px-page pt-section-top pb-section-bottom"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <div className="flex flex-col gap-16">
          <SectionTitle id="tools-title">{tools.headline}</SectionTitle>
          <Text variant="lead" tone="muted" className="max-w-(--container-lead)">
            {tools.sub}
          </Text>
        </div>
        <ul className="grid grid-cols-2 gap-16 lg:grid-cols-12 lg:gap-24">
          <li className="col-span-2 flex lg:col-span-6 lg:row-span-2">
            <ToolCard
              size="large"
              href={href("telugu-plate")}
              icon={teluguPlateIcon}
              title={tools.large.title}
              line={tools.large.line}
              action={tools.large.button}
              placeholderLabel={tools.large.photo}
              linkAs={NextLink}
              className="w-full"
            />
          </li>
          {beside.map((tool) => small(tool, "lg:col-span-3"))}
          {below.map((tool) => small(tool, "lg:col-span-4"))}
        </ul>
        <Button
          as={NextLink}
          href={localePath(lang, "/tools")}
          variant="secondary"
          className="w-full"
        >
          {t.site.free}
        </Button>
      </div>
    </StudioBackdrop>
  );
}
