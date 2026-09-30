"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
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
 * trackpad and the keyboard (tabbing to a card scrolls it into view) all work, with previous and
 * next buttons from md. No scroll-jacking and no auto-advance; the buttons disable at each end.
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
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const buttonClass =
    "flex size-target cursor-pointer items-center justify-center border border-strong text-primary transition-colors hover:bg-card disabled:cursor-not-allowed disabled:border-subtle disabled:text-muted";

  return (
    <div role="region" aria-label={label} className={className}>
      <div className="mb-16 hidden justify-end gap-8 md:flex">
        <button
          type="button"
          aria-label={previousLabel}
          disabled={edges.start}
          onClick={() => {
            scroll(-1);
          }}
          className={buttonClass}
        >
          <Icon icon={ArrowLeftIcon} size="md" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={edges.end}
          onClick={() => {
            scroll(1);
          }}
          className={buttonClass}
        >
          <Icon icon={ArrowRightIcon} size="md" />
        </button>
      </div>
      {/* Keyboard: the cards' own links and sliders take focus, and focusing one scrolls it into view;
          Chromium also makes scroll containers themselves focusable. */}
      <ul
        ref={list}
        aria-label={label}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-24 overflow-x-auto overscroll-x-contain pb-16 focus-visible:outline-offset-4"
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
