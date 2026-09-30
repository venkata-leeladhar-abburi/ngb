"use client";

import { cssDuration, cssVar } from "@ngb/ui";
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
 * Reveals each `[data-reveal-line]` child in turn, once, as the manifesto scrolls into view (home.md §4). GSAP loads only when the query matches. Lines are never hidden before the script runs,
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
          // Opacity, not visibility: the lines stay in the accessibility tree while they wait. Plays once
          // and always finishes (no scrub), so a reader who stops mid-section never sees half a line.
          gsap.from(element.querySelectorAll("[data-reveal-line]"), {
            opacity: 0,
            y: "0.5em",
            duration: cssDuration("--motion-slow") / 1000,
            stagger: 0.25,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 85%", once: true },
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
