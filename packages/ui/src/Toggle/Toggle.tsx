"use client";

import * as Switch from "@radix-ui/react-switch";
import { useId, type ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";

interface ToggleProps {
  /** Visible label, left of the switch (board 07). */
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  disabled?: boolean;
  /** Layout only. */
  className?: string;
}

/**
 * On/off switch (board 07, "I eat in a hostel or mess"). Space toggles it; the label toggles it on click.
 * Board 07 draws a round pill and knob, but circles are reserved for the play button
 * (ngb-design-system skill), so the track has the 8 px tag cut and the knob is square.
 *
 * **Use for:** an on/off setting that changes the result straight away: "I eat in a hostel or mess".
 *
 * **Not for:** consent or terms (Checkbox); choosing between two named options (SegmentedControl).
 */
export function Toggle({ label, className, ...props }: ToggleProps) {
  const id = useId();
  return (
    <div className={`flex items-center justify-between gap-24 ${className ?? ""}`}>
      <label htmlFor={id} className="cursor-pointer text-body text-primary">
        {label}
      </label>
      <Switch.Root id={id} asChild {...props}>
        <ChamferBox
          as="button"
          cut="tag"
          fill="bg-card group-data-[state=checked]/chamfer:bg-action"
          border="bg-(--border-color-strong) group-data-[state=checked]/chamfer:bg-action"
          className="inline-flex h-32 w-64 shrink-0 cursor-pointer items-center px-4 after:absolute after:inset-x-0 after:-inset-y-8 disabled:cursor-not-allowed"
        >
          <Switch.Thumb className="block size-24 bg-(--text-color-muted) transition-transform ease-out data-[state=checked]:translate-x-(--spacing-32) data-[state=checked]:bg-(--text-color-primary) forced-colors:bg-[ButtonText] forced-colors:forced-color-adjust-none" />
        </ChamferBox>
      </Switch.Root>
    </div>
  );
}
