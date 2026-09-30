import { CameraIcon } from "@phosphor-icons/react/ssr";

import { Icon } from "../../Icon";

interface PhotoPlaceholderProps {
  /** What the real photo will show, and why it is missing: "Photo: Nawin, hero pose (shoot pending)". */
  label: string;
  /**
   * Read out like the future photo's alt text (default). Decorative: hidden from screen readers, for
   * slots whose real photo will also be decorative (marquee posts).
   */
  decorative?: boolean;
  /** Inside a LeanFrame: centres the caption, where the slanted edges move least, and keeps it clear of them. */
  lean?: boolean;
  /** Layout only: size and place it like the photo it stands for (absolute inset-0, aspect-4/5, size-full...). It sets no position of its own. */
  className?: string;
}

/**
 * At a leaning frame's vertical centre its edges sit tan(8 deg) x half the height inside the content box
 * (LeanFrame widens its content by that much); the spacing covers the slant across the caption's own lines.
 */
const LEAN_CENTRE_INSET = "calc(tan(var(--shape-lean)) * -50cqh + var(--spacing-8))";

/**
 * Stand-in for a real photo that does not exist yet. The site never shows AI-made or stock people
 * (CLAUDE.md), so every missing photo is this clearly labelled block, sized like the real one so nothing
 * shifts when the photo arrives.
 *
 * **Use for:** any photo slot waiting for the shoot or for consented member photos.
 *
 * **Not for:** loading states (Skeleton); decoration that will never be a photo.
 */
export function PhotoPlaceholder({
  label,
  decorative = false,
  lean = false,
  className,
}: PhotoPlaceholderProps) {
  return (
    <div
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
      className={`flex overflow-hidden bg-alt p-16 text-muted ${lean ? "items-center" : "items-end"} ${className ?? ""}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--background-color-card) 0 var(--spacing-12), transparent var(--spacing-12) var(--spacing-24))",
        ...(lean ? { paddingInline: LEAN_CENTRE_INSET } : {}),
      }}
    >
      {/* min-w-0 and wrap-anywhere: in narrow slots (goal tiles at 360 px) a long word breaks instead of
          running past the frame. */}
      <span
        aria-hidden="true"
        className="flex min-w-0 items-start gap-8 font-label text-label uppercase"
      >
        <Icon icon={CameraIcon} size="sm" />
        <span className="min-w-0 wrap-anywhere">{label}</span>
      </span>
    </div>
  );
}
