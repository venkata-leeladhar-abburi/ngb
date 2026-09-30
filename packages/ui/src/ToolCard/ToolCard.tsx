import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ArrowRightIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { PhotoPlaceholder } from "../brand/PhotoPlaceholder";
import { TELUGU_LEAN } from "../brand/telugu";
import { Icon } from "../Icon";

interface ToolCardProps {
  href: string;
  /** A Phosphor icon, e.g. CalculatorIcon. */
  icon: PhosphorIcon;
  /** Tool name, e.g. "Calorie calculator". */
  title: ReactNode;
  /** One line from home.md section 6, e.g. "Your exact daily calories." */
  line: ReactNode;
  /**
   * large: the bento's big tile (the Telugu Plate counter, A3) with a photo and a button-look call to
   * action. The whole tile is still the one link: the call to action is not a separate control.
   */
  size?: "small" | "large";
  /** Large only: a next/image with fill. Without it, a labelled placeholder. */
  image?: ReactNode;
  /** Large only: placeholder label while the photo is missing. */
  placeholderLabel?: string;
  /** Large only: "Count my plate". */
  action?: ReactNode;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Free-tool tile (screen A3 bento): the whole chamfered tile is one link to the tool. The large size
 * adds a photo and a button-look call to action ("Count my plate") that is part of the same link.
 *
 * **Use for:** a free tool in the tools bento and tool lists; `size="large"` for the bento's one big tile.
 *
 * **Not for:** programs (ProgramCard) or videos (VideoCard).
 */
export function ToolCard({
  href,
  icon,
  title,
  line,
  size = "small",
  image,
  placeholderLabel = "Photo (shoot pending)",
  action,
  linkAs,
  className,
}: ToolCardProps) {
  if (size === "large") {
    return (
      <ChamferBox
        as={linkAs ?? "a"}
        href={href}
        cut="tool-card"
        fill="bg-card group-hover/chamfer:bg-alt"
        border="bg-(--border-color-subtle) group-hover/chamfer:bg-(--border-color-strong)"
        className={`flex flex-col text-primary transition-colors ${className ?? ""}`}
      >
        {/* Inset, so the photo never covers the card's cut corner; clipped here, not on the card, so the
            card's focus ring (outside the box) stays visible. */}
        <div className="relative mx-24 mt-24 min-h-(--spacing-128) flex-1 overflow-hidden">
          {image ?? (
            <PhotoPlaceholder decorative label={placeholderLabel} className="absolute inset-0" />
          )}
        </div>
        <div className="flex flex-col gap-12 p-24">
          <div
            className={`font-heading text-h2 leading-heading font-black uppercase italic [&:lang(te)]:leading-telugu ${TELUGU_LEAN}`}
          >
            {title}
          </div>
          <div className="text-muted">{line}</div>
          {action && (
            // Looks like the primary button but is part of the card's one link: no ring of its own.
            <ChamferBox
              as="span"
              cut="button"
              focusRing="none"
              fill="bg-action"
              className="mt-8 inline-flex h-(--button-height) w-full items-center justify-center gap-8 px-24 font-label text-label font-bold text-primary uppercase"
            >
              <span>{action}</span>
              <Icon icon={CaretRightIcon} size="sm" />
            </ChamferBox>
          )}
        </div>
      </ChamferBox>
    );
  }
  return (
    <ChamferBox
      as={linkAs ?? "a"}
      href={href}
      cut="tool-card"
      fill="bg-card group-hover/chamfer:bg-alt"
      border="bg-(--border-color-subtle) group-hover/chamfer:bg-(--border-color-strong)"
      className={`flex flex-col gap-12 p-24 text-primary transition-colors ${className ?? ""}`}
    >
      <Icon icon={icon} size="xl" />
      <div
        className={`font-heading text-h3 leading-heading font-black uppercase italic [&:lang(te)]:leading-telugu ${TELUGU_LEAN}`}
      >
        {title}
      </div>
      <div className="text-muted">{line}</div>
      <Icon icon={ArrowRightIcon} size="md" className="mt-auto self-end" />
    </ChamferBox>
  );
}
