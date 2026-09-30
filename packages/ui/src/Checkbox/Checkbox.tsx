"use client";

import { CheckIcon, WarningIcon } from "@phosphor-icons/react/ssr";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { useId, type ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

interface CheckboxProps {
  /** Visible label, right of the box. For consent, the exact words from voice.md. */
  label: ReactNode;
  /** Consent must start unticked (DPDP Act; screens.md B4). */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  /** Error under the label, with an icon and words. */
  error?: ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * Checkbox (board 07 style): a 24 px chamfered box, studio red when ticked, with a 44 px touch area
 * that includes the label. Radix provides the role, Space to toggle and a hidden input for forms.
 *
 * **Use for:** a single yes/no the person ticks: WhatsApp consent and photo consent (DPDP).
 *
 * **Not for:** settings that act at once (Toggle); one choice from several (RadioGroup, SegmentedControl, ChipGroup).
 */
export function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="flex items-start gap-12">
        <RadixCheckbox.Root
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          asChild
          {...props}
        >
          <ChamferBox
            as="button"
            cut="tag"
            fill="bg-card group-data-[state=checked]/chamfer:bg-action"
            border="bg-(--border-color-strong) group-data-[state=checked]/chamfer:bg-action group-aria-invalid/chamfer:bg-(--outline-color-focus)"
            className="mt-4 flex size-24 shrink-0 cursor-pointer items-center justify-center text-primary after:absolute after:-inset-12 disabled:cursor-not-allowed"
          >
            <RadixCheckbox.Indicator>
              <Icon icon={CheckIcon} size="sm" />
            </RadixCheckbox.Indicator>
          </ChamferBox>
        </RadixCheckbox.Root>
        <label htmlFor={id} className="min-h-target cursor-pointer text-body text-primary">
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className="mt-8 flex items-start gap-8 text-accent">
          <Icon icon={WarningIcon} size="md" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
