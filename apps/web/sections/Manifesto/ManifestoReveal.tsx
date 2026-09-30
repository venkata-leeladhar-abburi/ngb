"use client";

import { cssVar } from "@ngb/ui";
import { useEffect, useRef, type ReactNode } from "react";

/** Desktop only, and never with reduced motion (screens.md A2). */
const query = () =>
  `(min-width: ${cssVar("--breakpoint-lg")}) and (prefers-reduced-motion: no-preference)`;

interface ManifestoRevealProps {
  children: ReactNode;
  /** Layout only. */
  className?: string;
}

/**
 * Reveals each `[data-reveal-line]` child in turn as the manifesto scrolls through the viewport
 * (home.md §4). GSAP loads only when the query matches. Lines are never hidden before the script runs,
 * so without JavaScript, on phones and with reduced motion, everything is simply visible.
 */
export function ManifestoReveal({ children, className }: ManifestoRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia(query()).matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(query(), () => {
          gsap.from(element.querySelectorAll("[data-reveal-line]"), {
            autoAlpha: 0,
            y: "0.5em",
            stagger: 0.35,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 80%", end: "bottom 55%", scrub: true },
          });
        });
        revert = () => {
          media.revert();
        };
      },
    );
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
