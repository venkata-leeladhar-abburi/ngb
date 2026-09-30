interface SkeletonProps {
  /** Size and layout of the placeholder block, e.g. "h-16 w-full" or "aspect-4/3". */
  className?: string;
}

/**
 * Loading placeholder: a plain carbon block. Static on purpose (no shimmer), so it is calm on slow phones
 * and needs no reduced-motion version. Hidden from screen readers; mark the loading region with
 * aria-busy and say what is loading in words ("Calculating your number…").
 */
export function Skeleton({ className }: SkeletonProps) {
  return <span aria-hidden="true" className={`block rounded-card bg-alt ${className ?? ""}`} />;
}
