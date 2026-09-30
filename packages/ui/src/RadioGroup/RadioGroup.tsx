"use client";

import { WarningIcon } from "@phosphor-icons/react/ssr";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { useId, type ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";
import type { ChoiceOption } from "../SegmentedControl";

interface RadioGroupProps {
  /** The question. Shown above the options unless `hideLabel` (e.g. when a heading above says it). */
  label: ReactNode;
  hideLabel?: boolean;
  options: readonly ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Submits with a form under this name. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Error under the options, with an icon and words ("Pick one answer to go on."). */
  error?: ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * Radio list (Find my plan quiz, pages.md): one answer from 2 to 5, as full-width chamfered rows with
 * room for longer and Telugu answers. Each row has a chamfered marker (circles are only for play
 * buttons) that fills when chosen, plus bold text, so the choice never shows by colour alone.
 * A radio group: Tab reaches the chosen row, arrow keys move and select. The chosen row stays bone on red
 * when disabled, so the answer can still be read.
 *
 * **Use for:** every Find my plan quiz step, and other one-answer questions whose answers may be long or Telugu.
 *
 * **Not for:** short choices inside a tool form (SegmentedControl); filters (ChipGroup); lists of more than 5 (Select).
 */
export function RadioGroup({
  label,
  hideLabel = false,
  options,
  error,
  className,
  ...props
}: RadioGroupProps) {
  const labelId = useId();
  const errorId = `${labelId}-error`;
  return (
    <div className={className}>
      <span id={labelId} className={hideLabel ? "sr-only" : "block text-body text-primary"}>
        {label}
      </span>
      <RadixRadioGroup.Root
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        // No orientation: all four arrow keys move, like a native radio group.
        loop
        className={`flex flex-col gap-8 ${hideLabel ? "" : "mt-8"}`}
        {...props}
      >
        {options.map((option) => (
          <RadixRadioGroup.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled ?? false}
            asChild
          >
            <ChamferBox
              as="button"
              fill="bg-card group-hover/chamfer:bg-alt group-data-[state=checked]/chamfer:bg-action"
              border="bg-(--border-color-strong) group-data-[state=checked]/chamfer:bg-action"
              className="flex min-h-(--button-height) w-full cursor-pointer items-center gap-16 px-16 py-12 text-left text-body text-primary disabled:cursor-not-allowed data-[state=checked]:font-bold disabled:data-[state=unchecked]:text-muted md:px-24"
            >
              <ChamferBox
                focusRing="none"
                cut="tag"
                fill="bg-page"
                border="bg-(--border-color-strong) group-data-[state=checked]/chamfer:bg-(--text-color-primary)"
                className="flex size-24 shrink-0 items-center justify-center"
              >
                <RadixRadioGroup.Indicator className="size-12 rounded-card bg-(--text-color-primary) forced-colors:bg-[ButtonText] forced-colors:forced-color-adjust-none" />
              </ChamferBox>
              <span className="min-w-0 break-words">{option.label}</span>
            </ChamferBox>
          </RadixRadioGroup.Item>
        ))}
      </RadixRadioGroup.Root>
      {error && (
        <p id={errorId} className="mt-8 flex items-start gap-8 text-accent">
          <Icon icon={WarningIcon} size="md" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
