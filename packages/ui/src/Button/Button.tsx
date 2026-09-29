import type {
  ComponentPropsWithRef,
  ElementType,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from "react";

import { CaretRightIcon } from "@phosphor-icons/react/ssr";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

export type ButtonVariant = "primary" | "secondary" | "onRed";

type ButtonProps<T extends ElementType> = {
  /** Element to render: "button" (default), "a", or a Next.js Link for navigation. */
  as?: T;
  /** primary = studio red (the buy action); secondary = bone outline; onRed = bone fill on red sections. */
  variant?: ButtonVariant;
  /** Unavailable. Buttons use the native attribute; links get aria-disabled and ignore clicks. */
  disabled?: boolean;
  /** Working: shows three bars, keeps its width and name, stays focusable, ignores clicks. */
  loading?: boolean;
  /** The trailing caret. Defaults to on for primary and onRed, off for secondary (board 07). */
  arrow?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Layout only (margin, grid placement). Never colour or type. */
  className?: string;
  /** One line; uppercased by CSS, so write it in sentence case. */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className" | "disabled" | "onClick">;

const VARIANTS: Record<
  ButtonVariant,
  { text: string; fill: string; border?: string; onRed?: boolean; arrow: boolean }
> = {
  primary: {
    text: "text-(--button-primary-fg)",
    fill: "bg-(--button-primary-bg) group-active/chamfer:bg-(--button-primary-bg-pressed)",
    arrow: true,
  },
  secondary: {
    text: "text-(--button-secondary-fg)",
    // Transparent at rest so it sits on any dark ground; oxblood while pressed.
    fill: "bg-band opacity-0 group-active/chamfer:opacity-100",
    border: "bg-(--button-secondary-border)",
    arrow: false,
  },
  onRed: {
    text: "text-(--button-on-red-fg)",
    fill: "bg-(--button-on-red-bg) group-active/chamfer:bg-(--button-on-red-bg-pressed)",
    onRed: true,
    arrow: true,
  },
};

const DISABLED = { text: "text-(--button-disabled-fg)", fill: "bg-(--button-disabled-bg)" };

function LoadingBars() {
  return (
    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center gap-8">
      <span className="h-16 w-4 bg-current" />
      <span className="h-16 w-4 bg-current" />
      <span className="h-16 w-4 bg-current" />
    </span>
  );
}

/**
 * The NGB button (board 07): chamfered, 52 px tall, GT America Extended label.
 * Buy actions say "Start my plan"; free actions say "Try free tools" (CLAUDE.md).
 * Hover lifts 2 px; the board's brighter hover red fails contrast with bone text, so it is not used.
 */
export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  disabled = false,
  loading = false,
  arrow,
  onClick,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component: ElementType = as ?? "button";
  const isNativeButton = Component === "button";
  const blocked = disabled || loading;
  const style = VARIANTS[variant];
  const colours = disabled ? DISABLED : style;
  const showArrow = (arrow ?? style.arrow) && !loading && !disabled;
  // Disabled buttons of every variant share one flat fill with no border (board 07).
  const border = disabled ? undefined : style.border;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const interaction = blocked
    ? disabled
      ? "cursor-not-allowed"
      : "cursor-progress"
    : "cursor-pointer hover:-translate-y-(--motion-lift-button) active:translate-y-0";

  return (
    <ChamferBox
      as={Component}
      cut="button"
      fill={colours.fill}
      {...(border
        ? { border, hollow: true, borderWidth: "var(--button-secondary-border-width)" }
        : {})}
      focusRing={style.onRed ? "onRed" : "default"}
      className={`inline-flex h-(--button-height) min-w-target items-center justify-center gap-8 px-24 font-label text-label font-bold whitespace-nowrap uppercase transition-transform ease-out select-none ${colours.text} ${interaction} ${className ?? ""}`}
      {...(isNativeButton ? { type: "button", disabled: disabled || undefined } : {})}
      {...(!isNativeButton && disabled ? { "aria-disabled": true } : {})}
      {...(loading ? { "aria-busy": true, "aria-disabled": true } : {})}
      onClick={handleClick}
      {...props}
    >
      {/* The label stays (invisible) while loading, so the width and the accessible name do not change. */}
      <span>
        <span className={loading ? "opacity-0" : undefined}>{children}</span>
        {loading && <LoadingBars />}
      </span>
      {showArrow && <Icon icon={CaretRightIcon} size="sm" />}
    </ChamferBox>
  );
}
