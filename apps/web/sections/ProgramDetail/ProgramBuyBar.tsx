"use client";

import { StickyBuyBar } from "@ngb/ui";
import Link from "next/link";

import { useHiddenOver } from "../shared/useHiddenOver";

interface ProgramBuyBarProps {
  hideOver: readonly string[];
  name: string;
  priceInr: number;
  weeks: number;
  cta: { href: string; label: string };
  perDayLabel: string;
  label: string;
}

/** Phone buy bar (pages.md: "Sticky bar (phone)"): the program, its price and "Start my plan", once the hero has scrolled away. */
export function ProgramBuyBar({ hideOver, ...bar }: ProgramBuyBarProps) {
  const visible = useHiddenOver(hideOver);
  return <StickyBuyBar visible={visible} linkAs={Link} {...bar} />;
}
