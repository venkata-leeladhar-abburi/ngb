import type { ElementType, ReactNode } from "react";

import { Button } from "../Button";
import { perDayPrice } from "../ProgramCard";

interface BarShellProps {
  /** Shown only after the hero has scrolled away (the page decides, e.g. with an IntersectionObserver). */
  visible: boolean;
  /** Names the bar's landmark. */
  label: string;
  children: ReactNode;
}

/**
 * Bottom bar on phones (hidden from lg). Slides out of view when not visible and becomes inert, so
 * hidden buttons cannot be reached by Tab. While it shows, base.css reserves `scroll-padding-bottom` on the
 * page (via `data-sticky-bar`), so focused elements are never covered (screens.md B3, WCAG 2.4.11).
 */
function BarShell({ visible, label, children }: BarShellProps) {
  return (
    <>
      {/* Room at the end of the page for the bar (its padding, button and hairline), so the last
          content can scroll clear of it (2.4.11). Render the bar after the page's last content. */}
      <div
        aria-hidden="true"
        className="lg:hidden"
        style={{
          height:
            "calc(var(--button-height) + var(--spacing-24) + var(--spacing-4) + env(safe-area-inset-bottom))",
        }}
      />
      <aside
        data-sticky-bar=""
        aria-label={label}
        inert={!visible}
        className={`fixed inset-x-0 bottom-0 z-(--layer-sticky) border-t border-subtle bg-card px-page pt-12 shadow-hover transition-transform ease-out lg:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
        style={{ paddingBottom: "calc(var(--spacing-12) + env(safe-area-inset-bottom))" }}
      >
        {children}
      </aside>
    </>
  );
}

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

interface StickyBuyBarProps {
  visible: boolean;
  /** "Mass Builder". */
  name: string;
  priceInr: number;
  weeks: number;
  cta: { href: string; label: ReactNode };
  perDayLabel?: string;
  label?: string;
  linkAs?: ElementType;
}

/**
 * Program page bar (board 07, pages.md): program and price on the left, Start my plan on the right.
 *
 * **Use for:** the program page on phones, after the hero scrolls away.
 *
 * **Not for:** desktop; pages without a price (StickyActionBar); more than one sticky bar per page.
 */
export function StickyBuyBar({
  visible,
  name,
  priceInr,
  weeks,
  cta,
  perDayLabel = "a day",
  label = "Buy",
  linkAs,
}: StickyBuyBarProps) {
  return (
    <BarShell visible={visible} label={label}>
      <div className="flex items-center gap-16">
        <div className="min-w-0">
          <p className="font-heading text-h3 font-black break-words text-primary uppercase italic">
            {name}
          </p>
          <p className="font-data text-body whitespace-nowrap text-primary">
            {rupees.format(priceInr)}
          </p>
          <p className="font-data text-body whitespace-nowrap text-muted">
            {rupees.format(perDayPrice(priceInr, weeks))} {perDayLabel}
          </p>
        </div>
        <Button as={linkAs ?? "a"} href={cta.href} className="ml-auto shrink-0">
          {cta.label}
        </Button>
      </div>
    </BarShell>
  );
}

interface StickyActionBarProps {
  visible: boolean;
  /** "Start my plan". */
  primary: { href: string; label: ReactNode };
  /** "Try free tools". */
  secondary: { href: string; label: ReactNode };
  label?: string;
  linkAs?: ElementType;
}

/**
 * Homepage bar after the hero (handoff section 6): the buy action and the free action.
 *
 * **Use for:** the homepage on phones, after the hero scrolls away.
 *
 * **Not for:** desktop; program pages (StickyBuyBar); more than one sticky bar per page.
 */
export function StickyActionBar({
  visible,
  primary,
  secondary,
  label = "Quick actions",
  linkAs,
}: StickyActionBarProps) {
  const Link: ElementType = linkAs ?? "a";
  return (
    <BarShell visible={visible} label={label}>
      <div className="grid grid-cols-2 gap-8">
        <Button as={Link} href={secondary.href} variant="secondary" className="w-full px-12">
          {secondary.label}
        </Button>
        {/* No caret: two labels share 320 px, and with larger text spacing the caret pushed "Start my
            plan" past its box (1.4.12). */}
        <Button as={Link} href={primary.href} arrow={false} className="w-full px-12">
          {primary.label}
        </Button>
      </div>
    </BarShell>
  );
}
