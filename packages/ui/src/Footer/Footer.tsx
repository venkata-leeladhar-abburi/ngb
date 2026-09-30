import { InstagramLogoIcon, WhatsappLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { PosterWord } from "../brand/PosterWord";
import { Wordmark } from "../brand/Wordmark";
import { Icon } from "../Icon";
import { LangSwitch } from "../LangSwitch";

export interface FooterColumn {
  title: string;
  links: readonly { href: string; label: ReactNode }[];
}

interface FooterProps {
  /** "NGB Evolve. Real growth. Real hustle. No fake flexing." */
  brandLine: ReactNode;
  /** Programs, Free tools, Help (home.md section 13). */
  columns: readonly FooterColumn[];
  /** Follow links. Social icons are drawn from the network name. */
  social: readonly { network: "instagram" | "youtube" | "whatsapp"; href: string; label: string }[];
  followTitle?: string;
  /** "© 2026 [Registered business name], GSTIN [number], [City, State]" ([CONFIRM]). */
  legalLine: ReactNode;
  /** "Consult a doctor before starting any new exercise or diet plan." */
  healthLine: ReactNode;
  lang: { current: "en" | "te"; enHref: string; teHref: string };
  homeHref: string;
  homeLabel?: string;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

const SOCIAL_ICONS = {
  instagram: InstagramLogoIcon,
  youtube: YoutubeLogoIcon,
  whatsapp: WhatsappLogoIcon,
} as const;

/**
 * Site footer (screen A7, home.md section 13): wordmark and brand line, link columns, follow links,
 * the legal and health lines, and the language switch. The giant EVOLVE watermark is decorative.
 *
 * **Use for:** the site footer, once per page.
 *
 * **Not for:** section-level link lists (compose Link and Heading in a section).
 */
export function Footer({
  brandLine,
  columns,
  social,
  followTitle = "Follow",
  legalLine,
  healthLine,
  lang,
  homeHref,
  homeLabel = "NGB Evolve, home",
  linkAs,
  className,
}: FooterProps) {
  const Link: ElementType = linkAs ?? "a";
  const linkClass = "inline-flex min-h-target items-center text-muted hover:text-primary";
  return (
    <footer className={`relative overflow-hidden bg-page text-primary ${className ?? ""}`}>
      <PosterWord tone="ghost" className="absolute inset-x-0 top-16 text-center">
        Evolve
      </PosterWord>
      <div className="relative grid gap-32 pt-128 md:grid-cols-2 lg:grid-cols-6">
        <div className="md:col-span-2 lg:col-span-2">
          <Link
            href={homeHref}
            aria-label={homeLabel}
            className="inline-flex min-h-target items-center"
          >
            <Wordmark />
          </Link>
          <p className="mt-16 max-w-lead text-muted">{brandLine}</p>
        </div>
        {columns.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="lg:border-l lg:border-subtle lg:pl-24"
          >
            <h2 className="font-heading text-h3 font-black uppercase italic">{column.title}</h2>
            <ul className="mt-12">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label={followTitle} className="lg:border-l lg:border-subtle lg:pl-24">
          <h2 className="font-heading text-h3 font-black uppercase italic">{followTitle}</h2>
          <ul className="mt-12">
            {social.map((item) => (
              <li key={item.network}>
                <Link href={item.href} className={`${linkClass} gap-12`}>
                  <Icon icon={SOCIAL_ICONS[item.network]} size="lg" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="relative mt-48 flex flex-col gap-16 border-t border-subtle py-24 text-muted lg:flex-row lg:items-center">
        <p>{legalLine}</p>
        <p className="lg:mx-auto">{healthLine}</p>
        <LangSwitch {...lang} variant="inline" {...(linkAs ? { linkAs } : {})} />
      </div>
    </footer>
  );
}
