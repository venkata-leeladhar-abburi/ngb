import { Footer } from "@ngb/ui";
import NextLink from "next/link";

import { programs, social } from "@/content/catalog";
import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

interface SiteFooterProps {
  /** This page's path without the language prefix, so the language switch stays on the page. */
  path: `/${string}`;
}

/** Tools listed in the footer, as screen A7 shows them. */
const FOOTER_TOOLS = [
  "calorie-calculator",
  "telugu-plate",
  "protein",
  "bmi",
  "one-rep-max",
] as const;

/**
 * Site footer (home.md §13, screen A7): brand line, Programs, Free tools, Help and Follow, then the
 * legal and health lines and the language switch. The legal line is [CONFIRM]. The WhatsApp link
 * appears once a real channel exists. Privacy and Terms have no copy yet, so they are not linked.
 */
export async function SiteFooter({ path }: SiteFooterProps) {
  const { lang, t } = await getPageContent();
  const footer = t.home.footer;
  const tools = t.home.tools;
  const href = (to: `/${string}`) => localePath(lang, to);
  const toolTitle = (slug: (typeof FOOTER_TOOLS)[number]) =>
    slug === "telugu-plate" ? tools.large.title.replace(/\.$/, "") : tools.small[slug].title;

  return (
    <div className="px-page pb-48">
      <Footer
        className="mx-auto max-w-(--container-content)"
        brandLine={footer.brandLine}
        columns={[
          {
            title: footer.columns.programs,
            links: [
              ...programs.map((program) => ({
                href: href(`/programs/${program.slug}`),
                label: program.name,
              })),
              { href: href("/club"), label: footer.links.club },
              { href: href("/coaching"), label: footer.links.coaching },
            ],
          },
          {
            title: footer.columns.tools,
            links: FOOTER_TOOLS.map((slug) => ({
              href: href(`/tools/${slug}`),
              label: toolTitle(slug),
            })),
          },
          {
            title: footer.columns.help,
            links: [
              { href: href("/faq"), label: footer.links.faq },
              { href: href("/contact"), label: footer.links.contact },
              { href: href("/refund-policy"), label: footer.links.refund },
            ],
          },
        ]}
        social={[
          {
            network: "instagram",
            href: social.instagram,
            label: t.home.community.follow.instagram,
          },
          { network: "youtube", href: social.youtube, label: t.home.community.follow.youtube },
        ]}
        followTitle={footer.columns.follow}
        legalLine={footer.legal}
        healthLine={footer.health}
        lang={{ current: lang, enHref: localePath("en", path), teHref: localePath("te", path) }}
        homeHref={href("/")}
        homeLabel={t.site.homeLabel}
        linkAs={NextLink}
      />
    </div>
  );
}
