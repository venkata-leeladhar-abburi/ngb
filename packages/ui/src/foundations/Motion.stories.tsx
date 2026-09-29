import { tokens } from "@ngb/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FoundationPage, FoundationSection, ms, pxText } from "./parts";

const meta = {
  title: "Foundations/Motion",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Duration = keyof typeof tokens.motion.duration;

const uses: Record<Duration, string> = {
  fast: "Hover, press",
  base: "Cards, accordions",
  slow: "Section reveal",
  hero: "Hero word sliding behind Nawin",
};
const names = Object.keys(uses) as Duration[];
const longest = Math.max(...names.map((name) => ms(tokens.motion.duration[name])));
const [x1, y1, x2, y2] = tokens.motion.easing.out;

function MotionPage() {
  const [moved, setMoved] = useState(false);
  return (
    <FoundationPage
      board="Board 09"
      title="Motion"
      intro="One easing curve for everything. With reduced motion on, transitions become near-instant, and each component swaps movement for a fade."
    >
      <FoundationSection title="Durations">
        <button
          type="button"
          aria-pressed={moved}
          onClick={() => {
            setMoved((value) => !value);
          }}
          className="min-h-target bg-action px-24 font-label text-label font-bold uppercase"
        >
          Play all
        </button>
        <p role="status" className="sr-only">
          {moved ? "Squares moved to the end of their tracks" : "Squares at the start"}
        </p>
        <ul className="mt-24 flex flex-col gap-24">
          {names.map((name) => (
            <li key={name} className="md:grid md:grid-cols-4 md:items-center md:gap-24">
              <p className="mb-8 md:mb-0">
                <span className="block font-data">
                  motion.{name} {tokens.motion.duration[name]}
                </span>
                <span className="block text-muted">{uses[name]}</span>
              </p>
              <div className="md:col-span-3">
                {/* The square travels the track's own width (container query units), never beyond it. */}
                <div className="@container relative h-32 overflow-hidden rounded-card border border-subtle">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 block size-32 bg-action ease-out"
                    style={{
                      transitionProperty: "transform",
                      transitionDuration: `var(--motion-${name})`,
                      transform: moved ? "translateX(calc(100cqw - 100%))" : "none",
                    }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="mt-4 h-4 bg-action-pressed"
                  style={{ width: `${(ms(tokens.motion.duration[name]) / longest) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </FoundationSection>

      <FoundationSection title="Easing and lift">
        <div className="flex flex-wrap items-center gap-32">
          <svg
            role="img"
            aria-labelledby="ease-title"
            viewBox="-4 -4 108 108"
            className="size-128 rounded-card border border-subtle text-primary"
          >
            <title id="ease-title">Ease-out curve: fast start, soft landing</title>
            <path
              d={`M0 100 C ${x1 * 100} ${100 - y1 * 100} ${x2 * 100} ${100 - y2 * 100} 100 0`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <ul className="flex flex-col gap-8">
            <li className="font-data">
              ease-out · cubic-bezier({tokens.motion.easing.out.join(", ")})
            </li>
            <li>Fast start, soft landing. Used by every transition and animation.</li>
            <li>
              Lift on hover: buttons {pxText(tokens.motion.lift.button)}, cards{" "}
              {pxText(tokens.motion.lift.card)}.
            </li>
          </ul>
        </div>
      </FoundationSection>

      <FoundationSection title="Rules">
        <ul className="flex flex-col gap-8">
          <li>
            GSAP ScrollTrigger only for the Journey pan and the Manifesto line reveal, both off
            below {pxText(tokens.layout.breakpoint.md)}.
          </li>
          <li>Everything else uses Motion for React or CSS.</li>
          <li>Reduced motion: fades only; no pinning, no parallax.</li>
        </ul>
      </FoundationSection>
    </FoundationPage>
  );
}

export const Motion: Story = { render: () => <MotionPage /> };
