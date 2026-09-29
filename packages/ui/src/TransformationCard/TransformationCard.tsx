"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import * as Slider from "@radix-ui/react-slider";
import { useState, type ReactNode } from "react";

import { LeanFrame } from "../brand/LeanFrame";
import { Icon } from "../Icon";

interface TransformationCardProps {
  /** Member's first name and town. Placeholders until a consented result exists in the CMS. */
  name: string;
  town: string;
  weeks: number;
  /** Signed change with unit: "+7 kg", "-6 kg". */
  change: string;
  /** Before and after photos (next/image with fill and alt). Labelled placeholders are shown without them. */
  before?: ReactNode;
  after?: ReactNode;
  /** Localised text (pass Telugu on /te pages). */
  sliderLabel?: string;
  weeksLabel?: string;
  permissionLabel?: string;
  /** Layout only; the card is 3:4. */
  className?: string;
}

/**
 * Horizontal inset that keeps text inside the leaning frame: the lean shifts the edges by
 * tan(8 deg) x height between top and bottom (cqh resolves against the LeanFrame size container).
 */
const LEAN_SAFE_INSET = "calc(tan(var(--shape-lean)) * -100cqh + var(--spacing-16))";

function Placeholder({ label, tone }: { label: string; tone: "before" | "after" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex size-full items-start py-24 font-label text-label uppercase ${tone === "before" ? "bg-alt text-muted" : "text-primary"}`}
      style={{
        paddingInline: LEAN_SAFE_INSET,
        ...(tone === "after" ? { backgroundImage: "var(--gradient-ember)" } : {}),
      }}
    >
      {label}
    </div>
  );
}

/**
 * Transformation card (board 08, screen A4): an 8 degree lean, before on the left, after on the right,
 * with a divider the member can move. The divider is a slider: arrow keys move it, and a tap anywhere on
 * the photo jumps there (no dragging needed, WCAG 2.5.7). The handle is square: circles are only for play.
 */
export function TransformationCard({
  name,
  town,
  weeks,
  change,
  before,
  after,
  sliderLabel = "Before and after",
  weeksLabel = "weeks",
  permissionLabel = "Shared with permission",
  className,
}: TransformationCardProps) {
  const [value, setValue] = useState(50);
  return (
    <article className={className}>
      <LeanFrame className="aspect-3/4 w-full bg-card">
        <div className="@container relative size-full">
          <div className="absolute inset-0">
            {before ?? <Placeholder label="Before photo" tone="before" />}
          </div>
          <div
            className="absolute inset-y-0 right-0 overflow-hidden"
            style={{ width: `${100 - value}%` }}
          >
            <div className="absolute inset-y-0 right-0" style={{ width: "100cqw" }}>
              {after ?? <Placeholder label="After photo" tone="after" />}
            </div>
          </div>
          <Slider.Root
            value={[value]}
            onValueChange={([next]) => {
              if (next !== undefined) setValue(next);
            }}
            min={0}
            max={100}
            step={1}
            className="absolute inset-0 flex cursor-ew-resize touch-none items-center select-none"
          >
            <Slider.Track className="relative h-full grow">
              <Slider.Range className="absolute h-full" />
            </Slider.Track>
            <Slider.Thumb
              aria-label={sliderLabel}
              aria-valuetext={`${value}% before, ${100 - value}% after`}
              className="relative flex h-full w-4 items-center justify-center bg-(--text-color-primary) focus-visible:outline-(--focus-ring-color)"
            >
              <span className="flex size-target shrink-0 items-center justify-center bg-(--text-color-primary) text-on-gold">
                <Icon icon={CaretLeftIcon} size="sm" />
                <Icon icon={CaretRightIcon} size="sm" />
              </span>
            </Slider.Thumb>
          </Slider.Root>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 pt-64 pb-16"
            style={{
              paddingInline: LEAN_SAFE_INSET,
              backgroundImage: "linear-gradient(to top, var(--background-color-page), transparent)",
            }}
          >
            <h3 className="font-heading text-h2 font-black text-primary uppercase italic">
              {name}, {town}
            </h3>
            <p className="font-data text-body text-primary uppercase">
              {weeks} {weeksLabel} / {change}
            </p>
            <p className="mt-8 text-right text-primary">{permissionLabel}</p>
          </div>
        </div>
      </LeanFrame>
    </article>
  );
}
