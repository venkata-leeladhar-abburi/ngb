"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import * as Accordion from "@radix-ui/react-accordion";
import type { ReactNode } from "react";

import { ChamferBox } from "../brand/ChamferBox";
import { Icon } from "../Icon";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
  /** Index of the answer open at first; omit to start all closed. */
  defaultOpen?: number;
  /** Heading level of each question for the page outline. */
  headingLevel?: "h2" | "h3" | "h4";
  /** Layout only. */
  className?: string;
}

/**
 * FAQ accordion (board 08, home.md section 10): one answer open at a time; the open question turns
 * studio red. Radix handles the keyboard (Enter/Space toggle, arrows move between questions).
 *
 * **Use for:** question and answer lists: the homepage FAQ and the FAQ page.
 *
 * **Not for:** hiding content people need to compare, like program details (show it, or use Tabs).
 */
export function FaqAccordion({
  items,
  defaultOpen,
  headingLevel = "h3",
  className,
}: FaqAccordionProps) {
  const Heading = headingLevel;
  return (
    <Accordion.Root
      type="single"
      collapsible
      {...(defaultOpen === undefined ? {} : { defaultValue: String(defaultOpen) })}
      className={`flex flex-col gap-8 ${className ?? ""}`}
    >
      {items.map((item, index) => (
        <Accordion.Item key={item.question} value={String(index)}>
          <Accordion.Header asChild>
            <Heading>
              <Accordion.Trigger asChild>
                <ChamferBox
                  as="button"
                  fill="bg-card group-hover/chamfer:bg-alt group-data-[state=open]/chamfer:bg-action"
                  border="bg-(--border-color-strong) group-data-[state=open]/chamfer:bg-action"
                  className="flex min-h-(--button-height) w-full cursor-pointer items-center justify-between gap-16 px-24 py-12 text-left text-body font-bold text-primary"
                >
                  <span>{item.question}</span>
                  <span className="shrink-0">
                    <Icon
                      icon={PlusIcon}
                      size="md"
                      className="group-data-[state=open]/chamfer:hidden"
                    />
                    <Icon
                      icon={MinusIcon}
                      size="md"
                      className="hidden group-data-[state=open]/chamfer:block"
                    />
                  </span>
                </ChamferBox>
              </Accordion.Trigger>
            </Heading>
          </Accordion.Header>
          <Accordion.Content className="bg-card px-24 py-16 text-muted">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
