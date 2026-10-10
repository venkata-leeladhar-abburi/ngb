"use client";

import { ResultCard, Stepper, Text, TextField, VisuallyHidden } from "@ngb/ui";
import { useEffect, useRef } from "react";

import { teluguPlateIcon } from "@/content/catalog";
import type { Content } from "@/content";
import { fill } from "@/lib/format";
import { proteinTarget } from "@/lib/tools/protein";
import { MAX_PORTIONS, PLATE_FOODS, plateProtein, type PlateFoodId } from "@/lib/tools/teluguPlate";
import { readNumber } from "@/lib/tools/validate";

import { useUrlQuery } from "../shared/useUrlChoice";

interface PlateCounterProps {
  title: string;
  copy: Content["toolPages"]["tools"]["telugu-plate"];
  weightLabel: string;
  weightError: string;
}

/**
 * Telugu Plate protein counter (pages.md: Telugu Plate, screen B5): tap what you ate, see the
 * protein add up, and with your weight, how far you are from your target. Counts live in the URL
 * (`?egg=2&pappu=1&w=70`); nothing is sent to a server. Food values are [CONFIRM] (lib/tools).
 */
export function PlateCounter({ title, copy, weightLabel, weightError }: PlateCounterProps) {
  const [search, replaceQuery] = useUrlQuery();
  // The URL is unknown on the server; once in the browser, fill the weight from it if still empty.
  const weightInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("w");
    if (value && weightInput.current?.value === "") weightInput.current.value = value;
  }, []);
  const params = new URLSearchParams(search);

  const portions: Partial<Record<PlateFoodId, number>> = {};
  for (const food of PLATE_FOODS) {
    const count = Number(params.get(food.id));
    if (Number.isInteger(count) && count > 0) portions[food.id] = Math.min(count, MAX_PORTIONS);
  }
  const total = plateProtein(portions);

  const rawWeight = params.get("w");
  const weight = readNumber("weight", rawWeight);
  const target = "value" in weight ? proteinTarget(weight.value) : null;
  const details =
    target === null
      ? fill(copy.todayOnly, { total })
      : fill(total >= target ? copy.reached : copy.result, { total, target, gap: target - total });

  const setParam = (name: string, value: string | null) => {
    const next = new URLSearchParams(search);
    if (value === null || value === "") next.delete(name);
    else next.set(name, value);
    replaceQuery(next.toString());
  };

  return (
    <div className="grid gap-48 lg:grid-cols-12 lg:items-start lg:gap-24">
      <ul aria-label={copy.foodsLabel} className="flex flex-col max-lg:order-last lg:col-span-7">
        {PLATE_FOODS.map((food) => {
          const name = copy.foods[food.id].name;
          const count = portions[food.id] ?? 0;
          return (
            <li
              key={food.id}
              className="flex items-center justify-between gap-16 border-t border-subtle py-12"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <Text as="span">{name}</Text>
                <Text as="span" variant="data" tone="muted">
                  {fill(copy.perPortion, {
                    portion: copy.foods[food.id].portion,
                    protein: food.proteinG,
                  })}
                </Text>
              </div>
              <Stepper
                value={count}
                max={MAX_PORTIONS}
                onChange={(next) => {
                  setParam(food.id, next === 0 ? null : String(next));
                }}
                decreaseLabel={fill(copy.remove, { food: name })}
                increaseLabel={fill(copy.add, { food: name })}
                valueLabel={fill(copy.portions, { count })}
                className="shrink-0"
              />
            </li>
          );
        })}
      </ul>
      {/* Desktop: the summary column sticks beside the list (screens.md B5). Phones: the total alone
          sticks to the top, above the list, so every tap shows what it changed. */}
      <div className="flex flex-col gap-24 max-lg:contents lg:sticky lg:top-24 lg:col-span-5">
        <VisuallyHidden as="h2">{copy.today}</VisuallyHidden>
        <ResultCard
          icon={teluguPlateIcon}
          title={title}
          valueLabel={copy.today}
          value={fill(copy.value, { total })}
          details={details}
          className="max-lg:sticky max-lg:top-8 max-lg:z-(--layer-raised)"
        />
        <TextField
          ref={weightInput}
          name="weight"
          label={weightLabel}
          hint={target === null ? copy.weightHint : undefined}
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          error={rawWeight && "error" in weight ? weightError : undefined}
          // Checked when the field is left or Enter is pressed, never while a number is half typed.
          onBlur={(event) => {
            setParam("w", event.currentTarget.value.trim());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") setParam("w", event.currentTarget.value.trim());
          }}
        />
      </div>
    </div>
  );
}
