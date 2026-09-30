import type { ElementType } from "react";

import { ChamferBox, chamferClip } from "../brand/ChamferBox";

interface LangSwitchProps {
  /** The language of the current page. */
  current: "en" | "te";
  /** The same page in English and in Telugu (the switch keeps the user on the same page). */
  enHref: string;
  teHref: string;
  /**
   * boxed: the chamfered control from board 07's Forms panel.
   * inline: plain "EN | తె" text with a divider, as in the desktop nav and mobile header (board 07, A1).
   */
  variant?: "boxed" | "inline";
  /** Ground under an inline switch. On red, both languages are bone (muted text on red fails contrast). */
  tone?: "dark" | "red";
  /** Link component, e.g. Next.js Link. Defaults to "a". */
  linkAs?: ElementType;
  /** Names the navigation landmark. */
  label?: string;
  /** Layout only. */
  className?: string;
}

const LANGUAGES = [
  { code: "en", region: "en-IN", short: "EN", name: "English" },
  { code: "te", region: "te-IN", short: "తె", name: "తెలుగు" },
] as const;

/** Telugu script at label size looks far smaller than Latin capitals, so తె uses the h3 size (board 07). */
const SCRIPT_SIZE = { en: "font-label text-label uppercase", te: "text-h3 leading-none" } as const;

/**
 * Language switch "EN | తె". Two links, not a toggle: changing language is navigation.
 * The current language is marked with aria-current; each link carries its own lang and hreflang
 * (en-IN / te-IN, handoff section 6). The current language is also underlined or filled, never colour alone.
 */
export function LangSwitch({
  current,
  enHref,
  teHref,
  variant = "boxed",
  tone = "dark",
  linkAs,
  label = "Language",
  className,
}: LangSwitchProps) {
  const Link: ElementType = linkAs ?? "a";
  const hrefs = { en: enHref, te: teHref };

  const items = LANGUAGES.map(({ code, region, short, name }, index) => {
    const isCurrent = code === current;
    const look =
      variant === "boxed"
        ? `px-24 focus-visible:-outline-offset-4 ${isCurrent ? "bg-action focus-visible:outline-(--focus-ring-color-on-red)" : "hover:bg-alt"}`
        : tone === "red"
          ? `px-8 text-primary underline-offset-8 focus-visible:outline-(--focus-ring-color-on-red) ${isCurrent ? "underline" : "hover:underline"}`
          : `px-8 underline-offset-8 ${isCurrent ? "text-primary underline" : "text-muted hover:text-primary"}`;
    return (
      <li
        key={code}
        className={
          index > 0
            ? variant === "boxed"
              ? "border-l border-strong"
              : "flex items-center gap-8 before:h-16 before:border-l before:border-strong"
            : undefined
        }
      >
        <Link
          href={hrefs[code]}
          lang={code}
          hrefLang={region}
          aria-current={isCurrent ? "true" : undefined}
          aria-label={`${short}, ${name}`}
          className={`flex min-h-target min-w-target items-center justify-center font-bold ${SCRIPT_SIZE[code]} ${look}`}
        >
          {short}
        </Link>
      </li>
    );
  });

  return (
    <nav aria-label={label} className={className}>
      {variant === "boxed" ? (
        <ChamferBox
          focusRing="none"
          fill="bg-card"
          border="bg-(--border-color-strong)"
          className="inline-flex"
        >
          <ul className="flex" style={chamferClip("button")}>
            {items}
          </ul>
        </ChamferBox>
      ) : (
        <ul className="flex items-center gap-8">{items}</ul>
      )}
    </nav>
  );
}
