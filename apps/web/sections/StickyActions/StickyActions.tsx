"use client";

import { StickyActionBar } from "@ngb/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StickyActionsProps {
  /** id of the element that hides the bar while it is on screen (the hero). */
  watchId: string;
  label: string;
  buy: { href: string; label: string };
  free: { href: string; label: string };
}

/**
 * Homepage phone bar (handoff §6): "Start my plan" and "Try free tools", shown once the hero has
 * scrolled away. Hidden from lg (the header's button is always there).
 */
export function StickyActions({ watchId, label, buy, free }: StickyActionsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry ? !entry.isIntersecting : false);
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [watchId]);

  return (
    <StickyActionBar visible={visible} label={label} primary={buy} secondary={free} linkAs={Link} />
  );
}
