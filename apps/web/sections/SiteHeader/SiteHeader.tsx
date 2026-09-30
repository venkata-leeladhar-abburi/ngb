import { NavBar, type SiteNavProps } from "@ngb/ui";
import Link from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";

import { MobileNav } from "./MobileNav";

interface SiteHeaderProps {
  /** This page's path without the language prefix ("/"), so the language switch stays on the page. */
  path: `/${string}`;
}

/**
 * Site header (handoff §6, screen A1): NavBar from lg, MobileHeader below; both are rendered and CSS
 * shows one. No link is marked current on the homepage.
 */
export async function SiteHeader({ path }: SiteHeaderProps) {
  const { lang, t } = await getPageContent();
  const href = (to: `/${string}`) => localePath(lang, to);

  const nav: Omit<SiteNavProps, "linkAs"> = {
    homeHref: href("/"),
    homeLabel: t.site.homeLabel,
    links: [
      { href: href("/programs"), label: t.site.nav.programs },
      { href: href("/tools"), label: t.site.nav.tools },
      { href: href("/workouts"), label: t.site.nav.workouts },
      { href: href("/transformations"), label: t.site.nav.transformations },
      { href: href("/about"), label: t.site.nav.about },
    ],
    navLabel: t.site.navLabel,
    lang: {
      current: lang,
      enHref: localePath("en", path),
      teHref: localePath("te", path),
      label: t.site.langLabel,
    },
    cta: { href: "#programs", label: t.site.buy },
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
