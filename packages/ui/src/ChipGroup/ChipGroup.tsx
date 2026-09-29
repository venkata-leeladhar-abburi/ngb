"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { useId, type ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import type { ChoiceOption } from "../SegmentedControl";

interface ChipGroupProps {
  /** Names the group. Shown above the chips unless `hideLabel` (then it is read by screen readers only). */
  label: ReactNode;
  hideLabel?: boolean;
  options: readonly ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  /** Layout only. */
  className?: string;
}

/**
 * Chips (board 07 "Training focus"; screens A4 and B8 filters): one choice from a set of separate
 * chamfered chips that can wrap. A radio group: arrow keys move and select. Filters should also
 * write the choice to the URL (pages rule).
 */
export function ChipGroup({
  label,
  hideLabel = false,
  options,
  className,
  ...props
}: ChipGroupProps) {
  const labelId = useId();
  return (
    <div className={className}>
      <span id={labelId} className={hideLabel ? "sr-only" : "block text-body text-primary"}>
        {label}
      </span>
      <RadioGroup.Root
        aria-labelledby={labelId}
        orientation="horizontal"
        loop
        className={`flex flex-wrap gap-8 ${hideLabel ? "" : "mt-8"}`}
        {...props}
      >
        {options.map((option) => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled ?? false}
            asChild
          >
            <ChamferBox
              as="button"
              fill="bg-card group-hover/chamfer:bg-alt group-data-[state=checked]/chamfer:bg-action"
              border="bg-(--border-color-strong) group-data-[state=checked]/chamfer:bg-action"
              className="inline-flex h-(--button-height) min-w-target cursor-pointer items-center px-24 text-body text-primary disabled:cursor-not-allowed disabled:text-muted"
            >
              <span>{option.label}</span>
            </ChamferBox>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
