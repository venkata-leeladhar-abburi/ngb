import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

interface LinkCardProps {
  href: string;
  /** A Phosphor icon: UserIcon for coaching, CrownIcon for the Club. */
  icon: PhosphorIcon;
  /** The question: "Want a coach checking on you every week?" */
  title: ReactNode;
  /** Where it goes: "1:1 Coaching". */
  label: ReactNode;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Cross-sell card (screen A5, under the program cards): an icon, a question and where it leads. Dark on
 * the red studio, so it reads as a quieter next step than the program cards. The whole card is one link.
 *
 * **Use for:** "Want a coach…? 1:1 Coaching" and "Want every plan…? Join the Club".
 *
 * **Not for:** the programs themselves (ProgramCard); tools (ToolCard); a primary action (Button).
 */
export function LinkCard({ href, icon, title, label, linkAs, className }: LinkCardProps) {
  return (
    <ChamferBox
      as={linkAs ?? "a"}
      href={href}
      cut="tool-card"
      focusRing="onRed"
      fill="bg-band group-hover/chamfer:bg-page"
      border="bg-(--border-color-subtle)"
      className={`flex items-center gap-24 p-24 text-primary transition-colors md:p-32 ${className ?? ""}`}
    >
      <Icon icon={icon} size="xl" />
      <div className="flex flex-col gap-8">
        <div className="font-heading text-h2 leading-heading font-black break-words uppercase italic [&:lang(te)]:leading-telugu">
          {title}
        </div>
        <div className="flex items-center gap-8 font-label text-label font-bold uppercase">
          {label}
          <Icon icon={CaretRightIcon} size="sm" />
        </div>
      </div>
    </ChamferBox>
  );
}
