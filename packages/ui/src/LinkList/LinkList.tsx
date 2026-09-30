import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

export interface LinkListItem {
  href: string;
  /** "Chest". */
  label: ReactNode;
  /** Short muted detail on the right: "3 free". */
  meta?: ReactNode;
}

interface LinkListProps {
  /** Names the list for screen readers ("Muscle groups"). */
  label: string;
  items: readonly LinkListItem[];
  /** href of the row that matches what is shown next to the list (A4: the featured video's group). */
  current?: string;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * A short list of links in one chamfered panel (screen A4 muscle groups): label, a muted detail and a
 * caret per row. Each row is a full-width link at least 44 px tall. The `current` row is studio red
 * (bone text on it, 4.7:1) and marked aria-current, never by colour alone.
 *
 * **Use for:** a handful of sibling destinations, like the workout muscle groups.
 *
 * **Not for:** site navigation (NavBar, Footer); switching content in place (Tabs); long lists.
 */
export function LinkList({ label, items, current, linkAs, className }: LinkListProps) {
  const Link: ElementType = linkAs ?? "a";
  return (
    <ChamferBox
      focusRing="none"
      cut="tool-card"
      fill="bg-card"
      border="bg-(--border-color-subtle)"
      className={className ?? ""}
    >
      <ul aria-label={label}>
        {items.map((item) => (
          <li key={item.href} className="border-b border-subtle last:border-b-0">
            <Link
              href={item.href}
              aria-current={item.href === current ? "true" : undefined}
              className="group/row flex min-h-target items-center gap-16 px-24 py-12 text-primary transition-colors hover:bg-alt focus-visible:-outline-offset-4 aria-[current=true]:bg-action aria-[current=true]:focus-visible:outline-(--focus-ring-color-on-red)"
            >
              <span className="font-bold">{item.label}</span>
              {/* A real space, so the link reads "Chest 3 free", not "Chest3 free". */}
              {item.meta && (
                <>
                  {" "}
                  <span className="ml-auto whitespace-nowrap text-muted group-aria-[current=true]/row:text-primary">
                    {item.meta}
                  </span>
                </>
              )}
              <Icon icon={CaretRightIcon} size="sm" className={item.meta ? "" : "ml-auto"} />
            </Link>
          </li>
        ))}
      </ul>
    </ChamferBox>
  );
}
