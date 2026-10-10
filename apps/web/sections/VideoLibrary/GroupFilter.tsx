"use client";

import { ChipGroup } from "@ngb/ui";
import type { ReactNode } from "react";

import { useUrlChoice } from "../shared/useUrlChoice";

interface GroupFilterProps {
  label: string;
  allLabel: string;
  /** Each muscle group's rows, rendered on the server. */
  groups: readonly { id: string; label: string; content: ReactNode }[];
}

/**
 * Muscle-group chips over the video rows (pages.md: Free workouts, screen C1). The choice lives in
 * the URL (`?group=chest`, see useUrlChoice); groups that are not chosen are hidden, not removed.
 */
export function GroupFilter({ label, allLabel, groups }: GroupFilterProps) {
  const isGroup = (value: string | null): value is string =>
    value === "all" || groups.some((group) => group.id === value);
  const [chosen, choose] = useUrlChoice("group", isGroup, "all");

  return (
    <div className="flex flex-col gap-64">
      <ChipGroup
        label={label}
        hideLabel
        options={[
          { value: "all", label: allLabel },
          ...groups.map((group) => ({ value: group.id, label: group.label })),
        ]}
        value={chosen}
        onValueChange={choose}
      />
      {groups.map((group) => (
        <div key={group.id} hidden={chosen !== "all" && chosen !== group.id}>
          {group.content}
        </div>
      ))}
    </div>
  );
}
