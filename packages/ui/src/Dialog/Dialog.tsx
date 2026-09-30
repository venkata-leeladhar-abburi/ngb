"use client";

import { XIcon } from "@phosphor-icons/react/ssr";
import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { Icon } from "../Icon";

interface DialogProps {
  /** The element that opens the dialog, usually a Button. */
  trigger: ReactNode;
  /** Required: names the dialog for screen readers and is shown as its heading. */
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the close button (pass Telugu on /te pages). */
  closeLabel?: string;
}

/**
 * Modal dialog (share sheet, video player, confirmations). Radix traps focus, closes on Escape and on
 * the backdrop, returns focus to the trigger and hides the page behind it from screen readers.
 * Never use it for marketing pop-ups: the Instagram in-app browser audience leaves (CLAUDE.md gotchas).
 *
 * **Use for:** a task the person opened themselves: share sheet, video player, a confirmation.
 *
 * **Not for:** marketing pop-ups, newsletter prompts or anything that opens on its own; the mobile menu (MobileHeader has its own).
 */
export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  closeLabel = "Close",
}: DialogProps) {
  return (
    <RadixDialog.Root
      {...(open === undefined ? {} : { open })}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-(--layer-overlay) bg-page/80" />
        <RadixDialog.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          className="fixed top-1/2 left-1/2 z-(--layer-overlay) max-h-[calc(100dvh-var(--spacing-64))] w-[calc(100vw-var(--spacing-32))] max-w-(--container-lead) -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card border border-subtle bg-card p-24 text-primary shadow-hover"
        >
          <div className="flex items-start gap-16">
            <RadixDialog.Title className="font-heading text-h2 font-black uppercase italic">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close
              aria-label={closeLabel}
              className="-mt-8 -mr-8 ml-auto flex size-target shrink-0 cursor-pointer items-center justify-center"
            >
              <Icon icon={XIcon} size="lg" />
            </RadixDialog.Close>
          </div>
          {description && (
            <RadixDialog.Description className="mt-8 text-muted">
              {description}
            </RadixDialog.Description>
          )}
          {children && <div className="mt-24">{children}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
