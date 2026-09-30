import { CheckIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

import { Icon } from "../Icon";

interface ProgressStepsProps {
  /** Names the list, e.g. "Checkout steps". */
  label: string;
  /** Step names in order: "Your phone number", "Pay". */
  steps: readonly ReactNode[];
  /** Index of the current step (0-based). */
  current: number;
  /** Localised "Step {n} of {total}" for the visible counter. */
  counter?: (step: number, total: number) => string;
  /** Layout only. */
  className?: string;
}

/**
 * Progress through a short flow (checkout, the 4-question quiz). An ordered list: done steps show a
 * check, the current step is studio red and marked aria-current="step", later steps are muted.
 */
export function ProgressSteps({
  label,
  steps,
  current,
  counter = (step, total) => `Step ${step} of ${total}`,
  className,
}: ProgressStepsProps) {
  return (
    <nav aria-label={label} className={className}>
      <p className="font-data text-body text-muted">{counter(current + 1, steps.length)}</p>
      <ol className="mt-8 flex gap-8">
        {steps.map((step, index) => {
          const state = index < current ? "done" : index === current ? "current" : "next";
          return (
            <li
              key={index}
              aria-current={state === "current" ? "step" : undefined}
              className="flex min-w-0 flex-1 flex-col gap-8"
            >
              <span
                aria-hidden="true"
                className={`h-4 ${state === "next" ? "bg-(--border-color-strong)" : "bg-action"}`}
              />
              <span
                className={`flex items-center gap-4 text-body ${state === "next" ? "text-muted" : "text-primary"} ${state === "current" ? "font-bold" : ""}`}
              >
                {state === "done" && <Icon icon={CheckIcon} size="sm" />}
                <span className="min-w-0 truncate">{step}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
