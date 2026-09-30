import { CaretDownIcon, WarningIcon } from "@phosphor-icons/react/ssr";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

import { Icon } from "../Icon";

type SelectProps = {
  /** Always visible, above the field. */
  label: ReactNode;
  options: readonly { value: string; label: string }[];
  /** First, empty choice ("Choose one"). Omit when a default is always selected. */
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Layout only. */
  className?: string;
} & Omit<ComponentPropsWithRef<"select">, "className" | "children">;

/**
 * Select (board 07 field style). A native <select>, on purpose: the phone's own picker works best in the
 * Instagram in-app browser and with screen readers. Styled like TextField, with a caret instead of the
 * browser arrow.
 */
export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  id,
  className,
  "aria-describedby": describedBy,
  ...props
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const messageId = `${selectId}-message`;
  const message = error ?? hint;

  return (
    <div className={className}>
      <label htmlFor={selectId} className="block text-body text-primary">
        {label}
      </label>
      <div className="relative mt-8">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [describedBy, message ? messageId : undefined].filter(Boolean).join(" ") || undefined
          }
          className="block h-(--button-height) w-full cursor-pointer appearance-none rounded-card border border-strong bg-card pr-48 pl-16 text-body text-primary disabled:cursor-not-allowed disabled:text-muted aria-invalid:border-focus"
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-16 flex items-center text-primary">
          <Icon icon={CaretDownIcon} size="md" />
        </span>
      </div>
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
