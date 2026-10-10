"use client";

import { useEffect, useState } from "react";

/**
 * Whether a phone sticky bar should show: hidden while any of the named sections is on screen (the
 * hero, or a section whose own button already makes the same offer), shown otherwise. With no
 * sections to hide over, it is simply shown.
 */
export function useHiddenOver(ids: readonly string[]): boolean {
  const [visible, setVisible] = useState(ids.length === 0);

  useEffect(() => {
    const targets = ids
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
  }, [ids]);

  return visible;
}
