import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { LeanFrame } from "../brand/LeanFrame";
import { TELUGU_LEAN } from "../brand/telugu";
import { PhotoPlaceholder } from "../brand/PhotoPlaceholder";
import { Icon } from "../Icon";

interface GoalTileProps {
  href: string;
  /** "Gain weight". */
  title: ReactNode;
  /** "Skinny? Build real size, even on hostel food." */
  line: ReactNode;
  /** A next/image with fill (Nawin doing this kind of training). Without it, a labelled placeholder. */
  image?: ReactNode;
  /** Placeholder label while the photo is missing. */
  placeholderLabel?: string;
  /** Heading level of the title in the page outline. */
  titleAs?: "h2" | "h3";
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Goal tile (screen A3, home.md §5): a leaning photo, with the goal and one line upright below it. The
 * text sits outside the lean on purpose: inside it, a 2 x 2 phone grid would leave too little width for
 * the line (and for Telugu, which runs longer). The whole tile is one link; it lifts 8 px on hover and press.
 *
 * **Use for:** the four "What's your goal?" tiles that route a visitor to a program.
 *
 * **Not for:** tools (ToolCard), programs (ProgramCard) or member results (TransformationCard).
 */
export function GoalTile({
  href,
  title,
  line,
  image,
  placeholderLabel = "Photo (shoot pending)",
  titleAs: Title = "h3",
  linkAs,
  className,
}: GoalTileProps) {
  const Link: ElementType = linkAs ?? "a";
  return (
    <Link
      href={href}
      className={`group block text-primary transition-transform ease-out hover:-translate-y-(--motion-lift-card) active:-translate-y-(--motion-lift-card) motion-reduce:transform-none ${className ?? ""}`}
    >
      {/* Inset by the lean's overhang (tan 8° x half the 5:4 height), so the photo and the focus ring
          stay inside the tile. */}
      <div style={{ paddingInline: "calc(tan(var(--shape-lean)) * -62.5%)" }}>
        <LeanFrame className="aspect-4/5 w-full border border-subtle bg-card transition-colors group-hover:border-strong">
          {image ?? (
            <PhotoPlaceholder decorative lean label={placeholderLabel} className="size-full" />
          )}
        </LeanFrame>
      </div>
      <div className="flex flex-col gap-4 pt-16">
        <Title
          className={`font-heading text-h2 leading-heading font-black break-words uppercase italic [&:lang(te)]:leading-telugu ${TELUGU_LEAN}`}
        >
          {title}
        </Title>
        <p className="flex items-end justify-between gap-8 text-muted">
          <span>{line}</span>
          <Icon icon={ArrowRightIcon} size="md" className="shrink-0 text-primary" />
        </p>
      </div>
    </Link>
  );
}
