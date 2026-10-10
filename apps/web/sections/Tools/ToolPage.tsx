import { Link, SectionTitle, StudioBackdrop, Text } from "@ngb/ui";
import NextLink from "next/link";

import { programs } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

import { PlanCard } from "../ProgramsGrid";

import { CalcForm } from "./CalcForm";
import { PlateCounter } from "./PlateCounter";
import { isCalcTool, type BuiltTool } from "./tools";

/**
 * One free tool (pages.md: Free tool page and Telugu Plate, screens B4 and B5): the question as the
 * page title, the tool itself, the health line and the way back to all tools. The lead form and
 * "Share my result" arrive with the backend (Phase 7).
 */
export async function ToolPage({ tool }: { tool: BuiltTool }) {
  const { lang, t } = await getPageContent();
  const pages = t.toolPages;
  const copy = pages.tools[tool];
  const sub = "sub" in copy ? copy.sub : undefined;
  const title =
    tool === "telugu-plate"
      ? t.home.tools.large.title.replace(/\.$/, "")
      : t.home.tools.small[tool].title;

  return (
    <StudioBackdrop variant="night" className="px-page pt-64 pb-section-bottom">
      <div className="mx-auto flex max-w-(--container-content) flex-col gap-48">
        <div className="flex flex-col gap-16">
          <SectionTitle as="h1">{copy.headline}</SectionTitle>
          {sub && (
            <Text variant="lead" tone="muted" className="max-w-(--container-lead)">
              {sub}
            </Text>
          )}
        </div>
        {isCalcTool(tool) ? (
          <CalcForm
            tool={tool}
            title={title}
            copy={pages}
            plans={Object.fromEntries(
              programs.map((program) => [
                program.slug,
                <PlanCard
                  key={program.slug}
                  program={program}
                  lang={lang}
                  t={t}
                  headingLevel="h2"
                />,
              ]),
            )}
          />
        ) : (
          <PlateCounter
            title={title}
            copy={pages.tools["telugu-plate"]}
            weightLabel={pages.fields.weight}
            weightError={pages.errors.weight.range}
          />
        )}
        <div className="flex flex-col items-start gap-16 border-t border-subtle pt-24">
          <Text tone="muted" className="max-w-(--container-measure)">
            {pages.health}
          </Text>
          <Link as={NextLink} href={localePath(lang, "/tools")} variant="standalone">
            {pages.allTools}
          </Link>
        </div>
      </div>
    </StudioBackdrop>
  );
}
