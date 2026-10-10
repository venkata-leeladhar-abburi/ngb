import { NavBar, type SiteNavProps } from "@ngb/ui";
import Link from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

import { PROGRAMS_ID } from "../ProgramsGrid";

import { MobileNav } from "./MobileNav";

/** The five header links (handoff §6), in order. */
const NAV = [
  ["programs", "/programs"],
  ["tools", "/tools"],
  ["workouts", "/workouts"],
  ["transformations", "/transformations"],
  ["about", "/about"],
] as const;

/** Pages that hold the programs cards themselves: there "Start my plan" scrolls to them. */
const HAS_PROGRAMS: readonly string[] = ["/", "/programs"];

interface SiteHeaderProps {
  /** This page's path without the language prefix ("/"), so the language switch stays on the page. */
  path: `/${string}`;
}

/**
 * Site header (handoff §6, screen A1): NavBar from lg, MobileHeader below; both are rendered and CSS
 * shows one. The link for this page's section is marked current; none is on the homepage.
 */
export async function SiteHeader({ path }: SiteHeaderProps) {
  const { lang, t } = await getPageContent();
  const href = (to: `/${string}`) => localePath(lang, to);

  const nav: Omit<SiteNavProps, "linkAs"> = {
    homeHref: href("/"),
    homeLabel: t.site.homeLabel,
    links: NAV.map(([key, to]) => ({
      href: href(to),
      label: t.site.nav[key],
      current: path === to || path.startsWith(`${to}/`),
    })),
    navLabel: t.site.navLabel,
    lang: {
      current: lang,
      enHref: localePath("en", path),
      teHref: localePath("te", path),
      label: t.site.langLabel,
    },
    cta: {
      href: HAS_PROGRAMS.includes(path) ? `#${PROGRAMS_ID}` : href("/programs"),
      label: t.site.buy,
    },
  };

  return (
    <header className="border-b border-subtle bg-page px-page">
      <div className="mx-auto max-w-(--container-content)">
        <NavBar {...nav} linkAs={Link} />
        <MobileNav
          {...nav}
          openLabel={t.site.menu.open}
          closeLabel={t.site.menu.close}
          menuTitle={t.site.menu.label}
        />
      </div>
    </header>
  );
}
