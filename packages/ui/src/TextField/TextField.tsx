import { WarningIcon } from "@phosphor-icons/react/ssr";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

import { Icon } from "../Icon";

type TextFieldProps = {
  /** Always visible, above the field (CLAUDE.md: labels above inputs). */
  label: ReactNode;
  /** Helper text under the field. Replaced by the error while there is one. */
  hint?: ReactNode;
  /** Error under the field, with an icon and words; marks the field invalid. */
  error?: ReactNode;
  /** Layout only. */
  className?: string;
} & Omit<ComponentPropsWithRef<"input">, "className">;

/**
 * Text field (board 07). Use `inputMode` for numbers and phones, `autoComplete` where it applies,
 * and put units in the label ("Weight (kg)"). Font size stays 16 px or more so phones do not zoom.
 */
export function TextField({
  label,
  hint,
  error,
  id,
  className,
  "aria-describedby": describedBy,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-body text-primary">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        // Keep any description the caller passes, and add the hint or error.
        aria-describedby={
          [describedBy, message ? messageId : undefined].filter(Boolean).join(" ") || undefined
        }
        className="mt-8 block h-(--button-height) w-full rounded-card border border-strong bg-card px-16 text-body text-primary placeholder:text-muted disabled:cursor-not-allowed disabled:text-muted aria-invalid:border-focus"
        {...props}
      />
      {error ? (
        <p id={messageId} className="mt-8 flex items-start gap-8 text-accent">
          <Icon icon={WarningIcon} size="md" />
          <span>{error}</span>
        </p>
      ) : (
        hint && (
          <p id={messageId} className="mt-8 text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
