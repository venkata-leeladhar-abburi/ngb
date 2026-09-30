import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";

import { Icon } from "../Icon";

type LinkProps<T extends ElementType> = {
  /** Link component, e.g. Next.js Link. Defaults to "a". */
  as?: T;
  /**
   * inline: inside a sentence, underlined (links never rely on colour alone).
   * standalone: its own line ("Watch my story (2 min)"), bold signal red, underlined, with a caret and a 44 px target.
   */
  variant?: "inline" | "standalone";
  /** Layout only. */
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithRef<T>, "as" | "children" | "className">;

/**
 * A text link for going somewhere. Actions that buy or start something are Buttons ("Start my plan",
 * "Try free tools"), even when they are links underneath. The focus ring is the global signal red outline.
 *
 * **Use for:** going somewhere: links in sentences, and standalone text links like "Watch my story (2 min)".
 *
 * **Not for:** buying or starting something (Button, even when it is a link); navigation bars (NavBar, Footer); studio-red grounds (the signal red underline and focus ring fall below 3:1 there).
 */
export function Link<T extends ElementType = "a">({
  as,
  variant = "inline",
  className,
  children,
  ...props
}: LinkProps<T>) {
  const Component: ElementType = as ?? "a";
  const look =
    variant === "standalone"
      ? // Signal red and underlined (screens A2, A3, A6): 5.6:1 on the black ground; bone on hover.
        "inline-flex min-h-target items-center gap-8 font-body font-bold text-accent underline underline-offset-8 hover:text-primary"
      : "text-primary underline underline-offset-4 hover:text-accent";
  return (
    <Component
      className={`cursor-pointer decoration-(--text-color-accent) decoration-2 transition-colors ${look} ${className ?? ""}`}
      {...props}
    >
      {children}
      {variant === "standalone" && <Icon icon={CaretRightIcon} size="sm" />}
    </Component>
  );
}
