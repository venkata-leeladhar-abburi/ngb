"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { useState, type CSSProperties, type ReactNode } from "react";

import { Icon } from "../Icon";

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
 * own Pause button (WCAG 2.2.2), and becomes a static wrapped row with reduced motion. The second copy
 * that makes the loop seamless is hidden from screen readers and cannot be focused.
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
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={`flex shrink-0 gap-16 pr-16 ${hidden ? "motion-reduce:hidden" : "motion-reduce:flex-wrap motion-reduce:pr-0"}`}
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
      <div className="group/marquee overflow-hidden">
        <div
          className="flex w-max [animation:ngb-marquee_var(--marquee-seconds)_linear_infinite] [animation-play-state:var(--marquee-state)] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:[animation:none]"
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
      <button
        type="button"
        onClick={() => {
          setPaused((value) => !value);
        }}
        className="mt-16 inline-flex min-h-target cursor-pointer items-center gap-8 font-label text-label font-bold text-primary uppercase motion-reduce:hidden"
      >
        <Icon icon={paused ? PlayIcon : PauseIcon} size="md" />
        {paused ? playLabel : pauseLabel}
      </button>
    </div>
  );
}
