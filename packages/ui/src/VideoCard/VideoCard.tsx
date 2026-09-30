import { LockIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { chamferClip } from "../brand/ChamferBox";
import { PhotoPlaceholder } from "../brand/PhotoPlaceholder";
import { Icon } from "../Icon";
import { PlayMark } from "../PlayButton";
import { VisuallyHidden } from "../VisuallyHidden";

interface VideoCardProps {
  href: string;
  /** "Chest at home". For a locked card: "Full chest plan". */
  title: ReactNode;
  /** "12 min, Telugu". */
  meta?: ReactNode;
  /** A next/image with fill, or any cover image. A labelled placeholder is shown without one. */
  image?: ReactNode;
  /** Shown on the placeholder until the real thumbnail exists. */
  placeholderLabel?: string;
  /** Locked (paid) video: lock instead of play; links to the program. */
  locked?: boolean;
  /** Where the locked video lives: "Inside Mass Builder". */
  lockedLabel?: ReactNode;
  /** Screen-reader prefix for locked cards (pass Telugu on /te pages). */
  lockedPrefix?: string;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Video card (board 08): free cards show the red 44 px play button (the only circle in the system);
 * locked cards dim the image and show a lock. The whole card is one link.
 *
 * **Use for:** free and locked workout videos.
 *
 * **Not for:** the hero journey clip (its own play button in the hero section).
 */
export function VideoCard({
  href,
  title,
  meta,
  image,
  placeholderLabel = "Thumbnail (video pending)",
  locked = false,
  lockedLabel,
  lockedPrefix = "Locked:",
  linkAs,
  className,
}: VideoCardProps) {
  const Link: ElementType = linkAs ?? "a";
  return (
    <Link href={href} className={`group block text-primary ${className ?? ""}`}>
      <div className="relative aspect-4/3 overflow-hidden bg-alt" style={chamferClip("tool-card")}>
        {image ?? (
          <PhotoPlaceholder decorative label={placeholderLabel} className="absolute inset-0" />
        )}
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center ${locked ? "bg-page/70" : ""}`}
        >
          {locked ? (
            <Icon icon={LockIcon} size="xl" />
          ) : (
            <PlayMark className="transition-transform ease-out group-hover:scale-110" />
          )}
        </span>
      </div>
      <div className="mt-12 font-heading text-h3 font-black uppercase italic">
        <div>
          {locked && (
            <>
              <VisuallyHidden>{lockedPrefix}</VisuallyHidden>{" "}
            </>
          )}
          {title}
          {meta && (
            <>
              {" / "}
              <span className="text-muted">{meta}</span>
            </>
          )}
        </div>
        {locked && lockedLabel && <div className="text-muted">{lockedLabel}</div>}
      </div>
    </Link>
  );
}
