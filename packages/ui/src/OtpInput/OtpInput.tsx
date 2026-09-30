"use client";

import { tokens } from "@ngb/tokens";
import { WarningIcon } from "@phosphor-icons/react/ssr";
import { useId, useState, type ChangeEvent, type ReactNode } from "react";

import { Icon } from "../Icon";

interface OtpInputProps {
  /** Visible label above the boxes. */
  label: ReactNode;
  /** Controlled value (digits only). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once when every box is filled. */
  onComplete?: (code: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  name?: string;
  disabled?: boolean;
  id?: string;
  /** Layout only. */
  className?: string;
}

const LENGTH = tokens.component["otp-input"].length;

/**
 * One-time code input (board 07): six boxes drawn over a single real input, so SMS autofill
 * (`autocomplete="one-time-code"`), paste and screen readers all work as with a normal field.
 * No maxLength: the browser would cut "123 456" before the space is removed. Digits are capped in code.
 */
export function OtpInput({
  label,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  hint,
  error,
  name,
  disabled,
  id,
  className,
}: OtpInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const code = value ?? inner;
  const message = error ?? hint;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, LENGTH);
    if (value === undefined) setInner(digits);
    onChange?.(digits);
    if (digits.length === LENGTH && code.length !== LENGTH) onComplete?.(digits);
  };

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-body text-primary">
        {label}
      </label>
      <div
        className="relative mt-8 grid w-full grid-cols-6 gap-8"
        style={{ maxWidth: "calc(6 * var(--spacing-48) + 5 * var(--spacing-8))" }}
      >
        {Array.from({ length: LENGTH }, (_, index) => {
          const active =
            focused && (index === code.length || (index === LENGTH - 1 && code.length === LENGTH));
          const border =
            error || active ? "border-focus" : code[index] ? "border-strong" : "border-subtle";
          return (
            <span
              key={index}
              aria-hidden="true"
              data-otp-box={index}
              data-active={active || undefined}
              className={`flex h-(--button-height) min-w-0 items-center justify-center rounded-card border bg-card font-data text-readout ${border} ${active ? "outline-2 outline-offset-2 outline-focus" : ""}`}
            >
              {code[index] ?? ""}
            </span>
          );
        })}
        <input
          id={inputId}
          name={name}
          value={code}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          disabled={disabled}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="absolute inset-0 size-full cursor-text text-body opacity-0 disabled:cursor-not-allowed"
        />
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
