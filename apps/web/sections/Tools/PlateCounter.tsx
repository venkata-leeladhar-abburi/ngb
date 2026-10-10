"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import { Button, ResultCard, Text, TextField, VisuallyHidden } from "@ngb/ui";

import { teluguPlateIcon } from "@/content/catalog";
import type { Content } from "@/content";
import { fill } from "@/lib/format";
import { proteinTarget } from "@/lib/tools/protein";
import { MAX_PORTIONS, PLATE_FOODS, plateProtein, type PlateFoodId } from "@/lib/tools/teluguPlate";
import { readNumber } from "@/lib/tools/validate";

import { useHydrated } from "../shared/useHydrated";
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
  const hydrated = useHydrated();
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

  const change = (id: PlateFoodId, by: number) => {
    const count = Math.max(0, Math.min(MAX_PORTIONS, (portions[id] ?? 0) + by));
    setParam(id, count === 0 ? null : String(count));
  };

  return (
    <div className="grid gap-48 lg:grid-cols-12 lg:items-start lg:gap-24">
      <ul aria-label={copy.foodsLabel} className="flex flex-col lg:col-span-7">
        {PLATE_FOODS.map((food) => {
          const name = copy.foods[food.id].name;
          const count = portions[food.id] ?? 0;
          return (
            <li
              key={food.id}
              className="flex items-center justify-between gap-16 border-t border-subtle py-12"
            >
              <div className="flex flex-col">
                <Text as="span">{name}</Text>
                <Text as="span" variant="data" tone="muted">
                  {fill(copy.perPortion, {
                    portion: copy.foods[food.id].portion,
                    protein: food.proteinG,
                  })}
                </Text>
              </div>
              <div className="flex shrink-0 items-center gap-8">
                <Button
                  as="button"
                  variant="secondary"
                  icon={MinusIcon}
                  disabled={count === 0}
                  onClick={() => {
                    change(food.id, -1);
                  }}
                >
                  <VisuallyHidden>{fill(copy.remove, { food: name })}</VisuallyHidden>
                </Button>
                <Text as="span" variant="data" className="w-32 text-center">
                  {count}
                </Text>
                <Button
                  as="button"
                  variant="secondary"
                  icon={PlusIcon}
                  disabled={count === MAX_PORTIONS}
                  onClick={() => {
                    change(food.id, 1);
                  }}
                >
                  <VisuallyHidden>{fill(copy.add, { food: name })}</VisuallyHidden>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {/* Sticky on desktop only (screens.md B5); on phones it follows the list. */}
      <div className="flex flex-col gap-24 lg:sticky lg:top-24 lg:col-span-5">
        <VisuallyHidden as="h2">{copy.today}</VisuallyHidden>
        <ResultCard
          icon={teluguPlateIcon}
          title={title}
          valueLabel={copy.today}
          value={fill(copy.value, { total })}
          details={details}
        />
        <TextField
          key={hydrated ? "client" : "server"}
          name="weight"
          label={weightLabel}
          hint={copy.weightHint}
          inputMode="decimal"
          autoComplete="off"
          defaultValue={rawWeight ?? ""}
          error={rawWeight && "error" in weight ? weightError : undefined}
          onChange={(event) => {
            setParam("w", event.currentTarget.value.trim());
          }}
        />
      </div>
    </div>
  );
}
