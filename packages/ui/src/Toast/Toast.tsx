"use client";

import { CheckCircleIcon, WarningIcon, XIcon } from "@phosphor-icons/react/ssr";
import * as RadixToast from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Icon } from "../Icon";

type Tone = "info" | "good" | "error";

interface ToastMessage {
  id: number;
  message: ReactNode;
  tone: Tone;
}

type Show = (message: ReactNode, options?: { tone?: Tone }) => void;

const ToastContext = createContext<Show | null>(null);

/**
 * Shows a short message: `const toast = useToast(); toast("Link copied.")`. Use the microcopy library
 * (voice.md) for the words. Messages are announced politely (they never interrupt the screen reader),
 * stay 5 s (errors 8 s), and can be closed with their button or swiped away.
 *
 * **Use for:** short confirmations after an action: "Link copied."
 *
 * **Not for:** errors the person must fix (show them next to the field); anything they must read to continue.
 */
export function useToast(): Show {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}

const ICONS = { good: CheckCircleIcon, error: WarningIcon } as const;

/** Place once near the root of the app. Toasts sit above the phone sticky bars. */
export function ToastProvider({
  children,
  label = "Notifications",
  closeLabel = "Close",
}: {
  children: ReactNode;
  label?: string;
  /** Accessible name of each toast's close button (pass Telugu on /te pages). */
  closeLabel?: string;
}) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback<Show>((message, options) => {
    setToasts((current) => [
      ...current,
      { id: Date.now() + Math.random(), message, tone: options?.tone ?? "info" },
    ]);
  }, []);
  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider duration={5000} label={label}>
        {children}
        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            type="background"
            duration={toast.tone === "error" ? 8000 : 5000}
            onOpenChange={(open) => {
              if (!open) setToasts((current) => current.filter((item) => item.id !== toast.id));
            }}
            className="flex items-start gap-12 rounded-card border border-subtle bg-card p-16 text-body text-primary shadow-hover"
          >
            {toast.tone !== "info" && (
              <Icon
                icon={ICONS[toast.tone]}
                size="md"
                className={toast.tone === "good" ? "text-good" : "text-accent"}
              />
            )}
            <RadixToast.Description>{toast.message}</RadixToast.Description>
            <RadixToast.Close
              aria-label={closeLabel}
              className="-my-12 -mr-12 ml-auto flex size-target shrink-0 cursor-pointer items-center justify-center"
            >
              <Icon icon={XIcon} size="md" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed inset-x-0 bottom-0 z-(--layer-toast) flex flex-col gap-8 px-page pb-96 outline-none lg:right-0 lg:left-auto lg:w-(--container-lead) lg:pb-32" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
