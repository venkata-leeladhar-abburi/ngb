import type { ReactNode } from "react";

import { EmberSurface } from "../brand/EmberSurface";

interface ShareCardProps {
  /** Big words, 3 lines at most: "My daily target". */
  headline: ReactNode;
  /** The result: "2,480 kcal". */
  value: ReactNode;
  /** "Built with NGB Evolve". */
  signature?: ReactNode;
  /** Nawin's photo on the right (next/image with fill). */
  image?: ReactNode;
  /** Layout only; the card is 9:16. */
  className?: string;
}

/**
 * Story share card preview (board 08, handoff section 5): 9:16 on the ember gradient, text on the dark
 * zone. The downloadable 1080 x 1920 image is rendered on the server from the same content (Phase 6).
 *
 * **Use for:** the preview of a tool result someone can share as an Instagram story.
 *
 * **Not for:** normal result display on the page (ResultCard).
 */
export function ShareCard({
  headline,
  value,
  signature = "Built with NGB Evolve",
  image,
  className,
}: ShareCardProps) {
  return (
    <EmberSurface className={`relative aspect-9/16 p-24 ${className ?? ""}`}>
      {image && <div className="absolute inset-0">{image}</div>}
      {/* Text sits only on a dark zone (ember rule): a scrim under the block, whatever the photo behind. */}
      <div
        className="relative -mx-24 -mb-24 px-24 pt-96 pb-24"
        style={{
          backgroundImage: "linear-gradient(to top, var(--background-color-page) 60%, transparent)",
        }}
      >
        <p className="font-display text-h1 leading-display text-primary uppercase italic">
          {headline}
        </p>
        <p className="mt-16 font-data text-readout text-primary uppercase">{value}</p>
        <p className="mt-16 border-t border-(--text-color-primary) pt-12 text-primary">
          {signature}
        </p>
      </div>
    </EmberSurface>
  );
}
