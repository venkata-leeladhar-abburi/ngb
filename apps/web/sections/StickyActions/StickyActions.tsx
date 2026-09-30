"use client";

import { StickyActionBar } from "@ngb/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = hideOver
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null);
    if (targets.length === 0) return;
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setVisible(onScreen.size === 0);
    });
    for (const target of targets) observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [hideOver]);

  return (
    <StickyActionBar visible={visible} label={label} primary={buy} secondary={free} linkAs={Link} />
  );
}
