import { StudioBackdrop, ToolCard } from "@ngb/ui";
import NextLink from "next/link";

import { smallTools, teluguPlateIcon } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

import { PAGE_TITLE_ID } from "../PageHeader";

import { CALC_TOOLS } from "./tools";

/**
 * Free tools hub (handoff §6: `/tools`): the Telugu Plate as the large tile and the calculators that
 * are built. One-rep max, body fat and water join when their methods are confirmed.
 */
export async function ToolsHub() {
  const { lang, t } = await getPageContent();
  const tools = t.home.tools;
  const href = (slug: string) => localePath(lang, `/tools/${slug}`);

  return (
    <StudioBackdrop
      as="section"
      variant="night"
      aria-labelledby={PAGE_TITLE_ID}
      className="px-page pb-section-bottom"
    >
      <ul className="mx-auto grid max-w-(--container-content) grid-cols-2 gap-16 lg:grid-cols-12 lg:gap-24">
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
        {smallTools
          .filter((tool) => (CALC_TOOLS as readonly string[]).includes(tool.slug))
          .map((tool) => (
            <li key={tool.slug} className="flex lg:col-span-3">
              <ToolCard
                href={href(tool.slug)}
                icon={tool.icon}
                title={tools.small[tool.slug].title}
                line={tools.small[tool.slug].line}
                linkAs={NextLink}
                className="w-full"
              />
            </li>
          ))}
      </ul>
    </StudioBackdrop>
  );
}
