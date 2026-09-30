"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Effect = "rise" | "breathe";

interface RevealProps {
  /**
   * rise: comes up 24 px into place (the featured program card, A5).
   * breathe: grows and brightens once, then settles (the final-call glow, A7).
   */
  effect: Effect;
  children: ReactNode;
  /** Layout only. */
  className?: string;
}

type State = "idle" | "armed" | "shown";

const EFFECTS: Record<Effect, Record<State, string>> = {
  rise: {
    idle: "",
    armed: "translate-y-(--spacing-24) opacity-0",
    shown:
      "translate-y-0 opacity-100 transition-[translate,opacity] duration-(--motion-slow) ease-out",
  },
  breathe: {
    idle: "",
    armed: "",
    shown: "[animation:ngb-breathe_var(--motion-hero)_var(--ease-out)_1]",
  },
};

/**
 * Plays one small entrance once, when the element first scrolls into view. Without JavaScript, with
 * reduced motion, or when it is already on screen at load, the content simply shows: it is never
 * hidden waiting for a script. Hidden first only while still below the fold, so nothing jumps.
 *
 * **Use for:** the two moments handoff §11 names: the featured program card rising, the final-call glow.
 *
 * **Not for:** revealing ordinary content (it should just be there); scroll-linked or pinned motion.
 */
export function Reveal({ effect, children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setState("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      // Any visible pixel, a little above the fold line: a threshold ratio would never be reached by
      // content taller than the viewport, leaving it hidden.
      { threshold: 0, rootMargin: "0% 0% -15% 0%" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-reveal={state} className={`${EFFECTS[effect][state]} ${className ?? ""}`}>
      {children}
    </div>
  );
}
