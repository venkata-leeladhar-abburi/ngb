"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react/ssr";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";
import { VisuallyHidden } from "../VisuallyHidden";

interface StepperProps {
  /** The current count. */
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  /** Button names, with what is counted: "Remove one boiled egg", "Add one boiled egg". */
  decreaseLabel: string;
  increaseLabel: string;
  /** The count for screen readers, with its unit: "2 portions". Sighted users see the number. */
  valueLabel?: string;
  /** Layout only. */
  className?: string;
}

/**
 * Count up and down in ones (screen B5, Telugu Plate): a minus button, the number, a plus button.
 * Each button is a 44 px chamfered square. At a limit a button is muted and marked aria-disabled but
 * stays focusable, so the keyboard never loses its place when the count reaches 0.
 *
 * **Use for:** small whole-number counts: portions on the plate.
 *
 * **Not for:** free number entry such as weight or age (TextField); on/off (Toggle); one of a few choices (ChipGroup).
 */
export function Stepper({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onChange,
  decreaseLabel,
  increaseLabel,
  valueLabel,
  className,
}: StepperProps) {
  const button = (label: string, icon: typeof MinusIcon, next: number, blocked: boolean) => (
    <ChamferBox
      as="button"
      type="button"
      cut="tag"
      aria-label={label}
      aria-disabled={blocked || undefined}
      onClick={() => {
        if (!blocked) onChange(next);
      }}
      fill={blocked ? "bg-card" : "bg-card group-hover/chamfer:bg-alt group-active/chamfer:bg-band"}
      border={blocked ? "bg-(--border-color-subtle)" : "bg-(--border-color-strong)"}
      className={`flex size-target items-center justify-center ${blocked ? "cursor-not-allowed text-muted" : "cursor-pointer text-primary"}`}
    >
      <Icon icon={icon} size="md" />
    </ChamferBox>
  );

  return (
    <div className={`flex items-center gap-8 ${className ?? ""}`}>
      {button(decreaseLabel, MinusIcon, value - 1, value <= min)}
      <span className="min-w-(--spacing-32) text-center font-data text-body text-primary">
        <span aria-hidden={valueLabel ? true : undefined}>{value}</span>
        {valueLabel && <VisuallyHidden>{valueLabel}</VisuallyHidden>}
      </span>
      {button(increaseLabel, PlusIcon, value + 1, value >= max)}
    </div>
  );
}
