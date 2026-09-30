"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react/ssr";
import * as Dialog from "@radix-ui/react-dialog";
import type { ElementType } from "react";

import { StudioBackdrop } from "../brand/StudioBackdrop";
import { Wordmark } from "../brand/Wordmark";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { LangSwitch } from "../LangSwitch";
import type { SiteNavProps } from "../NavBar";

interface MobileHeaderProps extends SiteNavProps {
  /** Accessible names for the icon buttons and the menu (pass Telugu on /te pages). */
  openLabel?: string;
  closeLabel?: string;
  menuTitle?: string;
}

/**
 * Mobile header, 56 px (board 07, handoff section 6): wordmark, language switch and a menu button.
 * The menu opens full screen on the red studio with the links in Rush Driver. It is a modal dialog:
 * focus stays inside, Escape closes it, and following a link closes it.
 */
export function MobileHeader({
  homeHref,
  homeLabel = "NGB Evolve, home",
  links,
  lang,
  cta,
  linkAs,
  openLabel = "Open menu",
  closeLabel = "Close menu",
  menuTitle = "Menu",
  className,
}: MobileHeaderProps) {
  const Link: ElementType = linkAs ?? "a";
  const langProps = { ...lang, ...(linkAs ? { linkAs } : {}) };
  return (
    <div className={`flex h-nav items-center gap-8 lg:hidden ${className ?? ""}`}>
      <Link
        href={homeHref}
        aria-label={homeLabel}
        className="flex min-h-target min-w-0 shrink items-center"
      >
        <Wordmark size="sm" />
      </Link>
      <div className="ml-auto flex shrink-0 items-center">
        <LangSwitch {...langProps} variant="inline" />
        <Dialog.Root>
          <Dialog.Trigger
            className="flex size-target items-center justify-center text-primary"
            aria-label={openLabel}
          >
            <Icon icon={ListIcon} size="lg" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content asChild aria-describedby={undefined}>
              <StudioBackdrop className="fixed inset-0 z-(--layer-overlay) flex flex-col overflow-y-auto px-page pb-32">
                <Dialog.Title className="sr-only">{menuTitle}</Dialog.Title>
                <div className="flex h-nav items-center">
                  <Wordmark tone="red" />
                  <Dialog.Close
                    className="ml-auto flex size-target items-center justify-center text-primary focus-visible:outline-(--focus-ring-color-on-red)"
                    aria-label={closeLabel}
                  >
                    <Icon icon={XIcon} size="lg" />
                  </Dialog.Close>
                </div>
                <nav aria-label="Main" className="mt-32">
                  <ul className="flex flex-col gap-8">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Dialog.Close asChild>
                          <Link
                            href={link.href}
                            aria-current={link.current ? "page" : undefined}
                            className="flex min-h-target items-center font-heading text-h1 font-black text-primary uppercase italic focus-visible:outline-(--focus-ring-color-on-red)"
                          >
                            {link.label}
                          </Link>
                        </Dialog.Close>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-auto flex flex-col gap-16 pt-32">
                  <LangSwitch {...langProps} variant="inline" tone="red" />
                  <Dialog.Close asChild>
                    <Button as={Link} href={cta.href} variant="onRed">
                      {cta.label}
                    </Button>
                  </Dialog.Close>
                </div>
              </StudioBackdrop>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
