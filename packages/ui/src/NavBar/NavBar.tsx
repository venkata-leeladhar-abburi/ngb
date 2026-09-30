import type { ElementType, ReactNode } from "react";

import { Wordmark } from "../brand/Wordmark";
import { Button } from "../Button";
import { LangSwitch } from "../LangSwitch";

export interface NavLink {
  href: string;
  label: ReactNode;
  /** The current page: marked with aria-current. No link is current on the homepage (screen A1). */
  current?: boolean;
}

export interface SiteNavProps {
  homeHref: string;
  /** Accessible name of the logo link; must contain the visible wordmark ("NGB Evolve, home"). */
  homeLabel?: string;
  /** Programs · Free tools · Workouts · Transformations · About (handoff section 6). */
  links: readonly NavLink[];
  lang: { current: "en" | "te"; enHref: string; teHref: string };
  /** The buy action: "Start my plan". */
  cta: { href: string; label: ReactNode };
  /** Link component, e.g. Next.js Link. Defaults to "a". */
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Desktop navigation, 72 px (board 07, screen A1): wordmark, five links, language switch and the
 * primary button. Shown from the lg breakpoint only; MobileHeader covers smaller screens (render both).
 *
 * **Use for:** the desktop header, rendered next to MobileHeader on every page.
 *
 * **Not for:** section navigation or tabs inside a page (Tabs).
 */
export function NavBar({
  homeHref,
  homeLabel = "NGB Evolve, home",
  links,
  lang,
  cta,
  linkAs,
  className,
}: SiteNavProps) {
  const Link: ElementType = linkAs ?? "a";
  return (
    <div className={`hidden h-nav items-center gap-32 lg:flex ${className ?? ""}`}>
      <Link
        href={homeHref}
        aria-label={homeLabel}
        className="flex min-h-target shrink-0 items-center"
      >
        <Wordmark />
      </Link>
      <nav aria-label="Main">
        <ul className="flex items-center gap-24">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={`flex min-h-target items-center text-body underline-offset-8 hover:underline ${link.current ? "text-accent underline" : "text-primary"}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-24">
        <LangSwitch {...lang} {...(linkAs ? { linkAs } : {})} variant="inline" />
        <Button as={Link} href={cta.href}>
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
