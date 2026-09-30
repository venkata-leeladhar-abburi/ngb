"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  /** Names the tab list for screen readers (e.g. "Food plan"). */
  label: string;
  items: readonly TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** Layout only. */
  className?: string;
}

/**
 * Tabs (screen B3 food plan: veg / egg / non-veg, hostel / home). Radix provides the tab roles, arrow
 * keys between tabs and Tab into the open panel. The open tab is bone with a studio-red underline.
 */
export function Tabs({ label, items, defaultValue, className, ...props }: TabsProps) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value ?? ""}
      className={className}
      {...props}
    >
      <RadixTabs.List
        aria-label={label}
        className="flex gap-24 overflow-x-auto border-b border-subtle"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className="-mb-px min-h-target shrink-0 cursor-pointer border-b-4 border-transparent px-4 font-label text-label font-bold whitespace-nowrap text-muted uppercase hover:text-primary data-[state=active]:border-(--text-color-brand) data-[state=active]:text-primary"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.value}
          value={item.value}
          className="pt-24 text-body text-primary"
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
