import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { ElementType, ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

interface ToolCardProps {
  href: string;
  /** A Phosphor icon, e.g. CalculatorIcon. */
  icon: PhosphorIcon;
  /** Tool name, e.g. "Calorie calculator". */
  title: ReactNode;
  /** One line from home.md section 6, e.g. "Your exact daily calories." */
  line: ReactNode;
  linkAs?: ElementType;
  /** Layout only. */
  className?: string;
}

/**
 * Free-tool tile (screen A3 bento): the whole chamfered tile is one link to the tool.
 *
 * **Use for:** a free tool in the tools bento and tool lists.
 *
 * **Not for:** programs (ProgramCard) or videos (VideoCard).
 */
export function ToolCard({ href, icon, title, line, linkAs, className }: ToolCardProps) {
  return (
    <ChamferBox
      as={linkAs ?? "a"}
      href={href}
      cut="tool-card"
      fill="bg-card group-hover/chamfer:bg-alt"
      border="bg-(--border-color-subtle) group-hover/chamfer:bg-(--border-color-strong)"
      className={`flex flex-col gap-12 p-24 text-primary transition-colors ${className ?? ""}`}
    >
      <Icon icon={icon} size="xl" />
      <div className="font-heading text-h3 font-black uppercase italic">{title}</div>
      <div className="text-muted">{line}</div>
      <Icon icon={ArrowRightIcon} size="md" className="mt-auto self-end" />
    </ChamferBox>
  );
}
