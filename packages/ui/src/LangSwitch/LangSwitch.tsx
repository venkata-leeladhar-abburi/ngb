import type { ElementType } from "react";

import { ChamferBox, chamferClip } from "../brand/ChamferBox";
import { VisuallyHidden } from "../VisuallyHidden";

interface LangSwitchProps {
  /** The language of the current page. */
  current: "en" | "te";
  /** The same page in English and in Telugu (the switch keeps the user on the same page). */
  enHref: string;
  teHref: string;
  /** Link component, e.g. Next.js Link. Defaults to "a". */
  linkAs?: ElementType;
  /** Names the navigation landmark. */
  label?: string;
  /** Layout only. */
  className?: string;
}

/**
 * Language switch "EN | తె" (board 07). Two links, not a toggle: changing language is navigation.
 * The current language is marked with aria-current; each link carries its own lang and hreflang.
 * Telugu script at label size looks far smaller than Latin capitals, so తె uses body size (board 07).
 */
export function LangSwitch({
  current,
  enHref,
  teHref,
  linkAs,
  label = "Language",
  className,
}: LangSwitchProps) {
  const Link: ElementType = linkAs ?? "a";
  const languages = [
    { code: "en", href: enHref, short: "EN", name: "English" },
    { code: "te", href: teHref, short: "తె", name: "తెలుగు" },
  ] as const;

  return (
    <nav aria-label={label} className={className}>
      <ChamferBox
        focusRing="none"
        fill="bg-card"
        border="bg-(--border-color-strong)"
        className="inline-flex"
      >
        <ul className="flex" style={chamferClip("button")}>
          {languages.map(({ code, href, short, name }, index) => {
            const isCurrent = code === current;
            return (
              <li key={code} className={index > 0 ? "border-l border-strong" : undefined}>
                <Link
                  href={href}
                  lang={code}
                  hrefLang={code}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`flex min-h-target min-w-target items-center justify-center px-24 font-bold focus-visible:-outline-offset-4 ${code === "te" ? "text-body" : "font-label text-label uppercase"} ${isCurrent ? "bg-action focus-visible:outline-(--focus-ring-color-on-red)" : "hover:bg-alt"}`}
                >
                  {short}
                  <VisuallyHidden>, {name}</VisuallyHidden>
                </Link>
              </li>
            );
          })}
        </ul>
      </ChamferBox>
    </nav>
  );
}
