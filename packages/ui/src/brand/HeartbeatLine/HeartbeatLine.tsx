/** Straight segment that stretches to fill; the stroke keeps its width when stretched. */
function Flat() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      className="h-24 min-w-0 flex-1"
    >
      <path
        d="M0 12 H100"
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        fill="none"
      />
    </svg>
  );
}

/**
 * Heart-rate line (boards 06 and 08). Decoration only: hidden from screen readers, never a button.
 * Bone at 30% on dark grounds; signal red on the stat strip. The spike keeps its shape at any width.
 *
 * **Use for:** decoration in the proof strip and hero art.
 *
 * **Not for:** dividers between content, charts, or anything that carries meaning.
 */
export function HeartbeatLine({
  tone = "bone",
  className,
}: {
  tone?: "bone" | "red";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center ${tone === "red" ? "text-accent" : "text-primary opacity-30"} ${className ?? ""}`}
    >
      <Flat />
      <svg aria-hidden="true" viewBox="0 0 48 24" className="h-24 w-48 shrink-0">
        <path
          d="M0 12 H12 L16 12 L20 2 L25 22 L29 7 L32 12 H48"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <Flat />
    </div>
  );
}
