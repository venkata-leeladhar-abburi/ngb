"use client";

import { Dialog, Link } from "@ngb/ui";

interface StoryLinkProps {
  label: string;
  title: string;
  pending: string;
  closeLabel: string;
}

/**
 * "Watch my story (2 min)" (home.md §3): opens the story video in a dialog, so it is a button that looks
 * like a standalone link. The video does not exist yet, so the dialog says so (player in Phase 7).
 */
export function StoryLink({ label, title, pending, closeLabel }: StoryLinkProps) {
  return (
    <Dialog
      trigger={
        <Link as="button" type="button" variant="standalone">
          {label}
        </Link>
      }
      title={title}
      description={pending}
      closeLabel={closeLabel}
    />
  );
}
