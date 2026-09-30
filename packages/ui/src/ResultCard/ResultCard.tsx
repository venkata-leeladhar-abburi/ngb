import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

interface ResultCardProps {
  /** The tool's icon, e.g. CalculatorIcon. */
  icon: PhosphorIcon;
  /** "Calorie calculator". */
  title: ReactNode;
  /** "Your daily target". */
  valueLabel: ReactNode;
  /** "2,480 kcal". */
  value: ReactNode;
  /** More results under the readout: "Protein: 115 g a day." */
  details?: ReactNode;
  /** A healthy result: green, always with an icon and a word (board 02). */
  status?: ReactNode;
  /** Recommendation link: "Get the Shred 12 plan". */
  action?: { href: string; label: ReactNode };
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Tool result (board 08 "Tool card", screen B4). The result area is a polite live region, so the new
 * number is read out when it appears; the value sits in the mono readout box.
 *
 * **Use for:** the result of a free tool, with its next step.
 *
 * **Not for:** static numbers or stats (StatStrip).
 */
export function ResultCard({
  icon,
  title,
  valueLabel,
  value,
  details,
  status,
  action,
  linkAs,
  className,
}: ResultCardProps) {
  const Link: ElementType = linkAs ?? "a";
  return (
    <ChamferBox
      cut="tool-card"
      focusRing="none"
      fill="bg-card"
      border="bg-(--border-color-subtle)"
      className={`block p-24 text-primary ${className ?? ""}`}
    >
      <div>
        <div className="flex items-center gap-16">
          <Icon icon={icon} size="xl" />
          <h3 className="font-heading text-h3 font-black uppercase italic">{title}</h3>
        </div>
        <div aria-live="polite" aria-atomic="true" className="mt-16">
          <p className="text-muted">{valueLabel}</p>
          <p className="mt-8 inline-block rounded-card border border-strong px-16 py-8 font-data text-readout">
            {value}
          </p>
          {details && <p className="mt-12">{details}</p>}
          {status && (
            <p className="mt-12 flex items-center gap-8 text-good">
              <Icon icon={CheckCircleIcon} size="lg" />
              <span>{status}</span>
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="mt-16 inline-flex min-h-target items-center gap-8 text-accent underline-offset-4 hover:underline"
          >
            {action.label}
            <Icon icon={ArrowRightIcon} size="sm" />
          </Link>
        )}
      </div>
    </ChamferBox>
  );
}
