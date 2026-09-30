"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

import { Icon } from "../Icon";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Old WebViews and test environments may lack matchMedia: then the row simply moves.
const hasMatchMedia = () => typeof window.matchMedia === "function";

function subscribeToMotion(onChange: () => void) {
  if (!hasMatchMedia()) return () => undefined;
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => {
    query.removeEventListener("change", onChange);
  };
}

const prefersReducedMotion = () => hasMatchMedia() && window.matchMedia(REDUCED_MOTION).matches;

interface MarqueeProps {
  /** Names the region, e.g. "Community". */
  label: string;
  /** The row's items (photo tiles, words). Each becomes a list item. */
  items: readonly ReactNode[];
  /** Seconds for one full loop. */
  seconds?: number;
  /** Localised button words. */
  pauseLabel?: string;
  playLabel?: string;
  /** Layout only. */
  className?: string;
}

/**
 * The page's one marquee (screen A6 community row). It pauses on hover, on keyboard focus and with its
 * own Pause button (WCAG 2.2.2), and becomes a still row people scroll themselves with reduced motion. The second copy
 * that makes the loop seamless is hidden from screen readers and cannot be focused.
 *
 * **Use for:** the one moving row per page (community Instagram posts).
 *
 * **Not for:** important content people must read or reach; a second marquee on the same page.
 */
export function Marquee({
  label,
  items,
  seconds = 40,
  pauseLabel = "Pause",
  playLabel = "Play",
  className,
}: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, () => false);
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={`flex shrink-0 gap-16 pr-16 ${hidden ? "motion-reduce:hidden" : "motion-reduce:pr-0"}`}
    >
      {items.map((item, index) => (
        <li key={index} className="shrink-0">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div role="region" aria-label={label} className={className}>
      {/* With reduced motion it is one still row people scroll themselves, so only then does it take
          focus (arrow keys scroll it; axe: scrollable-region-focusable). */}
      <div
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable
        tabIndex={reduced ? 0 : undefined}
        className="group/marquee overflow-hidden focus-visible:-outline-offset-4 motion-reduce:overflow-x-auto"
      >
        <div
          className="flex w-max [animation:ngb-marquee_var(--marquee-seconds)_linear_infinite] [animation-play-state:var(--marquee-state)] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:[animation:none] motion-reduce:px-page"
          style={
            {
              "--marquee-seconds": `${seconds}s`,
              "--marquee-state": paused ? "paused" : "running",
            } as CSSProperties
          }
        >
          {row(false)}
          {row(true)}
        </div>
      </div>
      {/* The row runs edge to edge; its control sits on the page grid. */}
      <div className="mt-16 px-page motion-reduce:hidden">
        <div className="mx-auto max-w-(--container-content)">
          <button
            type="button"
            onClick={() => {
              setPaused((value) => !value);
            }}
            className="inline-flex min-h-target cursor-pointer items-center gap-8 font-label text-label font-bold text-primary uppercase"
          >
            <Icon icon={paused ? PlayIcon : PauseIcon} size="md" />
            {paused ? playLabel : pauseLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
