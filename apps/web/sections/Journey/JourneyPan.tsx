"use client";

import { cssVar } from "@ngb/ui";
import { useEffect, useRef, type ReactNode } from "react";

/** Desktop only, and never with reduced motion (screens.md A2). Below 1024 px the row is a SwipeRow. */
const query = () =>
  `(min-width: ${cssVar("--breakpoint-lg")}) and (prefers-reduced-motion: no-preference)`;

/**
 * Pins the journey row while its five cards pan in sideways, each from further right, so the story
 * reads left to right as you scroll (home.md §3). GSAP loads only when the query matches, so phones and
 * reduced-motion visitors never download it. Without JavaScript the row is simply in place.
 */
export function JourneyPan({ children }: { children: ReactNode }) {
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
          gsap.from(element.querySelectorAll("[data-pan]"), {
            xPercent: (index: number) => 40 + index * 30,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "center center",
              end: "+=60%",
              pin: true,
              scrub: true,
            },
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

  return <div ref={ref}>{children}</div>;
}
