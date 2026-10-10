"use client";

import { StickyActionBar } from "@ngb/ui";
import Link from "next/link";

import { useHiddenOver } from "../shared/useHiddenOver";

interface StickyActionsProps {
  /**
   * ids of the sections that hide the bar while any of them is on screen: the hero, and the sections
   * whose own buttons already make the same offer (tools, programs), so two identical buttons never show.
   */
  hideOver: readonly string[];
  label: string;
  buy: { href: string; label: string };
  free: { href: string; label: string };
}

/**
 * Homepage phone bar (handoff §6): "Start my plan" and "Try free tools", shown once the hero has
 * scrolled away and hidden again over the tools and programs sections. Hidden from lg (the header's
 * button is always there).
 */
export function StickyActions({ hideOver, label, buy, free }: StickyActionsProps) {
  const visible = useHiddenOver(hideOver);

  return (
    <StickyActionBar visible={visible} label={label} primary={buy} secondary={free} linkAs={Link} />
  );
}
