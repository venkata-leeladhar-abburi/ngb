"use client";

import { Dialog, PlayButton } from "@ngb/ui";

interface HeroPlayProps {
  label: string;
  title: string;
  pending: string;
  closeLabel: string;
}

/**
 * The hero's play button (home.md §1): opens the 30-second journey clip in a dialog. The clip does not
 * exist yet, so the dialog says so (swap in the Mux/Bunny player in Phase 7).
 */
export function HeroPlay({ label, title, pending, closeLabel }: HeroPlayProps) {
  return (
    <Dialog
      trigger={<PlayButton label={label} tone="bone" />}
      title={title}
      description={pending}
      closeLabel={closeLabel}
    />
  );
}
