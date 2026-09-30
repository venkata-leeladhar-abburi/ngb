"use client";

import { tokens } from "@ngb/tokens";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

import { HeartbeatLine } from "../brand/HeartbeatLine";

export type Stat =
  | {
      value: number;
      label: ReactNode;
      /** Appended after the number: "+", "%". */
      suffix?: string;
      /** 1000000 -> "1M". */
      compact?: boolean;
      /** Count up once when first seen. Off for years. Default true. */
      countUp?: boolean;
    }
  | {
      /** A number that is not confirmed yet, shown as-is so it looks like a placeholder ("[REAL DATA]"). */
      placeholder: string;
      label: ReactNode;
    };

interface StatStripProps {
  stats: readonly Stat[];
  /** Layout only. */
  className?: string;
}

const DURATION = Number.parseFloat(tokens.motion.duration.hero);

function format(value: number, compact: boolean): string {
  if (!compact) return String(Math.round(value));
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(Math.round(value));
}

/**
 * Shows the real number by default, so the server HTML, crawlers and slow phones always see it.
 * If the strip starts off screen, it counts up from 0 once when scrolled into view; if it is already
 * visible on load (desktop hero), it stays still so nothing flickers. No animation with reduced motion.
 */
function useCountUp(target: number, enabled: boolean) {
  const ref = useRef<HTMLLIElement>(null);
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    // Old WebViews and test environments may lack these; the real number is already showing.
    if (typeof IntersectionObserver === "undefined" || typeof window.matchMedia !== "function")
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let first = true;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry?.isIntersecting ?? false;
      if (first) {
        first = false;
        if (visible) {
          observer.disconnect();
          return;
        }
        setCurrent(0);
        return;
      }
      if (!visible) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION, 1);
        setCurrent(target * (1 - (1 - progress) ** 4));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, enabled]);

  return { ref, current };
}

function StatItem({ stat }: { stat: Stat }) {
  const isNumber = "value" in stat;
  const { ref, current } = useCountUp(
    isNumber ? stat.value : 0,
    isNumber && (stat.countUp ?? true),
  );
  const final = isNumber
    ? `${format(stat.value, stat.compact ?? false)}${stat.suffix ?? ""}`
    : stat.placeholder;
  const shown = isNumber
    ? `${format(current, stat.compact ?? false)}${stat.suffix ?? ""}`
    : stat.placeholder;

  return (
    <li ref={ref} className="flex min-w-0 flex-col items-center text-center">
      {/* The animated number is hidden; screen readers get the final value once. */}
      <span
        aria-hidden="true"
        className={
          isNumber
            ? "font-display text-display leading-display uppercase italic tabular-nums"
            : "font-data text-readout break-words"
        }
      >
        {shown}
      </span>
      <span className="sr-only">{final}</span>
      <span className="mt-8 font-heading text-h3 font-black uppercase italic lg:text-h2">
        {stat.label}
      </span>
    </li>
  );
}

/**
 * Proof strip (board 08, home.md section 2): an oxblood band of big numbers in Rush Driver with a
 * signal-red heart-rate line running between them. Numbers count up once when scrolled into view.
 *
 * **Use for:** the proof strip of real, confirmed numbers.
 *
 * **Not for:** invented or unconfirmed numbers; tool results (ResultCard).
 */
export function StatStrip({ stats, className }: StatStripProps) {
  return (
    <div className={`bg-band py-24 text-primary ${className ?? ""}`}>
      <ul className="grid grid-cols-2 gap-24 md:flex md:items-center">
        {stats.map((stat, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <li aria-hidden="true" className="hidden min-w-32 flex-1 md:block">
                <HeartbeatLine tone="red" />
              </li>
            )}
            <StatItem stat={stat} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
