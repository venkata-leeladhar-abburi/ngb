import { PlayIcon } from "@phosphor-icons/react/ssr";
import type { ComponentPropsWithRef } from "react";

import { Icon } from "../Icon";

type Tone = "action" | "bone";

const TONES: Record<Tone, string> = {
  // Studio red with bone: video cards on dark grounds (board 05, "Play button 44 px").
  action: "bg-action text-primary group-active:bg-action-pressed",
  // The on-red button colours: on the red studio, where a red button would disappear (screen A1).
  bone: "bg-(--button-on-red-bg) text-(--button-on-red-fg) group-active:bg-(--button-on-red-bg-pressed)",
};

/** The round play mark alone, for inside a link that is already the control (VideoCard). */
export function PlayMark({ tone = "action", className }: { tone?: Tone; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-(--play-button-size) items-center justify-center rounded-full ${TONES[tone]} ${className ?? ""}`}
    >
      <Icon icon={PlayIcon} size="md" />
    </span>
  );
}

type PlayButtonProps = {
  /** Names the video: "Play the 30-second journey clip". */
  label: string;
  tone?: Tone;
  /** Layout only. */
  className?: string;
} & Omit<ComponentPropsWithRef<"button">, "children" | "className" | "aria-label">;

/**
 * The play button (board 05): 44 px, the only circle in the system. A real button named after its video;
 * it opens the player (a Dialog). Hover grows it slightly, pressed darkens it; the focus ring follows the circle.
 *
 * **Use for:** playing a video that sits on its own, like the hero journey clip.
 *
 * **Not for:** video cards (VideoCard draws the mark inside its link); any other round control.
 */
export function PlayButton({ label, tone = "action", className, ...props }: PlayButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      // On the red studio the signal-red ring would vanish (about 1.7:1), so bone buttons get the bone ring.
      className={`group cursor-pointer rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${tone === "bone" ? "focus-visible:outline-(--focus-ring-color-on-red)" : ""} ${className ?? ""}`}
      {...props}
    >
      <PlayMark
        tone={tone}
        className="transition-transform ease-out group-hover:scale-110 group-active:scale-100 group-disabled:scale-100 forced-colors:border-2 forced-colors:border-[ButtonText]"
      />
    </button>
  );
}
