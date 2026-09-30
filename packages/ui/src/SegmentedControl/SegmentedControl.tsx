"use client";

import { CheckIcon } from "@phosphor-icons/react/ssr";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useId, type ReactNode } from "react";

import { ChamferBox, chamferClip } from "../brand/ChamferBox";
import { Icon } from "../Icon";

export interface ChoiceOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface SegmentedControlProps {
  /** Visible label above the control; also names the radio group. */
  label: ReactNode;
  options: readonly ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Submits with a form under this name. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Layout only. */
  className?: string;
}

/**
 * Segmented control (board 07, "Your goal"): 2 to 4 mutually exclusive choices in one chamfered bar.
 * A radio group: Tab reaches the chosen segment, arrow keys move and select.
 *
 * **Use for:** 2 to 4 short, equal choices inside a tool form (board 07 "Your goal").
 *
 * **Not for:** quiz steps (RadioGroup, which fits long and Telugu answers); switching views (Tabs); language (LangSwitch).
 */
export function SegmentedControl({ label, options, className, ...props }: SegmentedControlProps) {
  const labelId = useId();
  return (
    <div className={className}>
      <span id={labelId} className="block text-body text-primary">
        {label}
      </span>
      <ChamferBox
        focusRing="none"
        fill="bg-card"
        border="bg-(--border-color-strong)"
        className="mt-8 inline-flex"
      >
        <RadioGroup.Root
          aria-labelledby={labelId}
          orientation="horizontal"
          loop
          className="flex"
          style={chamferClip("button")}
          {...props}
        >
          {options.map((option, index) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled ?? false}
              className={`inline-flex h-(--button-height) min-w-target cursor-pointer items-center justify-center gap-8 px-16 text-body text-primary transition-colors hover:bg-alt focus-visible:-outline-offset-8 disabled:cursor-not-allowed data-[state=checked]:bg-action data-[state=checked]:font-bold data-[state=checked]:focus-visible:outline-(--focus-ring-color-on-red) disabled:data-[state=unchecked]:text-muted md:px-24 ${index > 0 ? "border-l border-strong" : ""}`}
            >
              <RadioGroup.Indicator>
                <Icon icon={CheckIcon} size="sm" />
              </RadioGroup.Indicator>
              {option.label}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </ChamferBox>
    </div>
  );
}
