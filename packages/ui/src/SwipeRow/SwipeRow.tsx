"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Icon } from "../Icon";

interface SwipeRowProps {
  /** Names the row: "Member results". */
  label: string;
  items: readonly ReactNode[];
  /** Layout only: the width of each item ("w-4/5 md:w-1/3"). */
  itemClassName?: string;
  /** Previous and next button names (pass Telugu on /te pages). */
  previousLabel?: string;
  nextLabel?: string;
  /** Layout only. */
  className?: string;
}

/**
 * A row people swipe sideways (screens A2 on phones, A4): native scroll with snap points, so touch,
 * trackpad and the keyboard (the row is focusable and arrow keys scroll it) all work, with previous and
 * next carets from md. No scroll-jacking and no auto-advance; at each end a caret is muted and
 * aria-disabled but keeps focus.
 *
 * **Use for:** a set of equal cards wider than the screen, like member results.
 *
 * **Not for:** the one marquee (Marquee); content everyone must see (lay it out instead).
 */
export function SwipeRow({
  label,
  items,
  itemClassName,
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
}: SwipeRowProps) {
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const element = list.current;
    if (!element) return;
    // One pixel of slack for sub-pixel scroll positions.
    setEdges({
      start: element.scrollLeft <= 1,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (direction: 1 | -1) => {
    const element = list.current;
    if (!element) return;
    // At an end the button stays focusable (aria-disabled), so a keyboard user never loses their place.
    if ((direction === 1 && edges.end) || (direction === -1 && edges.start)) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Bare carets with a 44 px target (screen A4), muted at an end.
  const buttonClass =
    "flex size-target cursor-pointer items-center justify-center text-primary transition-colors hover:text-accent aria-disabled:cursor-not-allowed aria-disabled:text-muted";

  return (
    <div role="region" aria-label={label} className={className}>
      <div className="mb-8 hidden justify-end gap-8 md:flex">
        <button
          type="button"
          aria-label={previousLabel}
          aria-disabled={edges.start}
          onClick={() => {
            scroll(-1);
          }}
          className={buttonClass}
        >
          <Icon icon={CaretLeftIcon} size="lg" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          aria-disabled={edges.end}
          onClick={() => {
            scroll(1);
          }}
          className={buttonClass}
        >
          <Icon icon={CaretRightIcon} size="lg" />
        </button>
      </div>
      {/* The row itself takes focus (arrow keys scroll it), so cards with nothing focusable inside are
          still reachable by keyboard in every browser (axe: scrollable-region-focusable). Its ring is
          drawn inside, as a full-bleed row has no room outside it. Padding leaves
          room for leaning cards' corners and their hover lift; the region above already names it. */}
      <ul
        ref={list}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable
        tabIndex={0}
        onScroll={update}
        className="flex snap-x snap-mandatory scroll-px-32 gap-24 overflow-x-auto overscroll-x-contain px-32 pt-(--motion-lift-card) pb-16 focus-visible:-outline-offset-4"
      >
        {items.map((item, index) => (
          // Items are static content in a fixed order, so the index is a stable key.
          <li key={index} className={`shrink-0 snap-start ${itemClassName ?? ""}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
