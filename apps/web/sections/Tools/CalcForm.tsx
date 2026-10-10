"use client";

import { Button, Heading, ResultCard, Select, Text, TextField, VisuallyHidden } from "@ngb/ui";
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";

import { smallTools, type ProgramSlug } from "@/content/catalog";
import type { Content } from "@/content";
import { fill, formatNumber } from "@/lib/format";
import { bmi, healthyWeightRange, isHealthyBmi } from "@/lib/tools/bmi";
import {
  ACTIVITIES,
  SEXES,
  dailyCalories,
  weightGainCalories,
  type Activity,
  type Sex,
} from "@/lib/tools/calories";
import { proteinTarget } from "@/lib/tools/protein";
import { readNumber, type NumberField } from "@/lib/tools/validate";

import { useUrlQuery } from "../shared/useUrlChoice";

import {
  GOALS,
  TOOL_FIELDS,
  recommendedProgram,
  type CalcTool,
  type Goal,
  type ToolField,
} from "./tools";

const NUMBER_FIELDS: readonly ToolField[] = ["age", "height", "weight"];
const CHOICES = { sex: SEXES, activity: ACTIVITIES, goal: GOALS } as const;

/** Short URL keys, so a shared result link stays readable. */
const PARAM: Record<ToolField, string> = {
  age: "age",
  sex: "sex",
  height: "h",
  weight: "w",
  activity: "act",
  goal: "goal",
};

type Errors = Partial<Record<ToolField, string>>;
type Copy = Content["toolPages"];

const isOneOf = <T extends string>(options: readonly T[], value: string | null): value is T =>
  value !== null && (options as readonly string[]).includes(value);

interface Result {
  valueLabel: string;
  value: string;
  details: string;
  status?: string;
  goal: Goal | null;
}

/** The result for the values in the URL, or null while any input is missing or out of range. */
function resultFor(tool: CalcTool, params: URLSearchParams, copy: Copy): Result | null {
  const number = (field: NumberField) => {
    const read = readNumber(field, params.get(PARAM[field]));
    return "value" in read ? read.value : null;
  };
  const weightKg = number("weight");
  if (weightKg === null) return null;

  if (tool === "protein") {
    const protein = proteinTarget(weightKg);
    return {
      valueLabel: copy.dailyTarget,
      value: fill(copy.tools.protein.value, { protein }),
      details: fill(copy.tools.protein.details, { protein }),
      goal: null,
    };
  }

  const heightCm = number("height");
  if (heightCm === null) return null;

  if (tool === "bmi") {
    const value = bmi(weightKg, heightCm);
    const range = healthyWeightRange(heightCm);
    return {
      valueLabel: copy.tools.bmi.valueLabel,
      value: value.toFixed(1),
      details: fill(copy.tools.bmi.details, {
        bmi: value.toFixed(1),
        height: heightCm,
        min: range.minKg,
        max: range.maxKg,
      }),
      ...(isHealthyBmi(value) ? { status: copy.tools.bmi.healthy } : {}),
      goal: null,
    };
  }

  const age = number("age");
  const sex = params.get(PARAM.sex);
  const activity = params.get(PARAM.activity);
  if (age === null || !isOneOf<Sex>(SEXES, sex) || !isOneOf<Activity>(ACTIVITIES, activity)) {
    return null;
  }
  const body = { sex, age, heightCm, weightKg };

  if (tool === "weight-gain") {
    const kcal = formatNumber(weightGainCalories(body, activity));
    return {
      valueLabel: copy.dailyTarget,
      value: fill(copy.tools["weight-gain"].value, { kcal }),
      details: fill(copy.tools["weight-gain"].details, { kcal }),
      goal: null,
    };
  }

  const goal = params.get(PARAM.goal);
  if (!isOneOf<Goal>(GOALS, goal)) return null;
  return {
    valueLabel: copy.dailyTarget,
    value: fill(copy.tools["calorie-calculator"].value, {
      kcal: formatNumber(dailyCalories(body, activity)),
    }),
    details: fill(copy.tools["calorie-calculator"].details, { protein: proteinTarget(weightKg) }),
    goal,
  };
}

interface CalcFormProps {
  tool: CalcTool;
  title: string;
  copy: Copy;
  /** Program cards rendered on the server; the result picks which one to show. */
  plans: Partial<Record<ProgramSlug, ReactNode>>;
}

/**
 * A free calculator (pages.md: Free tool page, screen B4): the form, its result and the plan the
 * result points to. The maths runs in the browser (`lib/tools`); nothing is sent to a server. Inputs
 * live in the URL, so a refresh, the back button and a shared link all keep the result.
 */
export function CalcForm({ tool, title, copy, plans }: CalcFormProps) {
  const [search, replaceQuery] = useUrlQuery();
  const [errors, setErrors] = useState<Errors>({});
  // The URL is unknown on the server, so the inputs render empty. Once in the browser, fill the ones
  // still empty from the URL; anything already typed on a slow phone is left alone.
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    for (const field of TOOL_FIELDS[tool]) {
      const control = form.current?.elements.namedItem(field);
      const value = query.get(PARAM[field]);
      if (
        value &&
        (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) &&
        control.value === ""
      ) {
        control.value = value;
      }
    }
  }, [tool]);
  const params = new URLSearchParams(search);
  const fields: readonly ToolField[] = TOOL_FIELDS[tool];
  const result = resultFor(tool, params, copy);
  const plan = result ? recommendedProgram(tool, result.goal) : null;
  const icon = smallTools.find((item) => item.slug === tool)?.icon;

  const submit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const target = event.currentTarget;
    const data = new FormData(target);
    const next = new URLSearchParams(search);
    const found: Errors = {};
    for (const field of fields) {
      const raw = data.get(field);
      const text = typeof raw === "string" ? raw.trim() : "";
      if (field === "age" || field === "height" || field === "weight") {
        const read = readNumber(field, text);
        if ("error" in read) found[field] = copy.errors[field][read.error];
      } else if (!isOneOf<string>(CHOICES[field], text)) {
        found[field] = copy.errors[field];
      }
      next.set(PARAM[field], text);
    }
    setErrors(found);
    const firstInvalid = fields.find((field) => found[field]);
    if (firstInvalid) {
      const control = target.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    replaceQuery(next.toString());
  };

  return (
    <div className="grid gap-48 lg:grid-cols-12 lg:items-start lg:gap-24">
      <form
        ref={form}
        noValidate
        onSubmit={submit}
        className="grid gap-24 md:grid-cols-2 lg:col-span-7"
      >
        {fields.map((field) =>
          NUMBER_FIELDS.includes(field) ? (
            <TextField
              key={field}
              name={field}
              label={copy.fields[field]}
              inputMode="decimal"
              autoComplete="off"
              error={errors[field]}
            />
          ) : (
            <Select
              key={field}
              name={field}
              label={copy.fields[field]}
              placeholder={copy.fields.choose}
              options={CHOICES[field as keyof typeof CHOICES].map((value) => ({
                value,
                label: choiceLabel(copy, field, value),
              }))}
              error={errors[field]}
            />
          ),
        )}
        <Button as="button" type="submit" className="md:col-span-2 md:justify-self-start">
          {copy.submit}
        </Button>
      </form>
      <div className="flex flex-col gap-24 lg:col-span-5">
        {/* The card's own title is an h3; this keeps the outline whole under the page's h1. */}
        <VisuallyHidden as="h2">{copy.resultTitle}</VisuallyHidden>
        {icon && (
          <ResultCard
            icon={icon}
            title={title}
            valueLabel={result?.valueLabel ?? copy.resultTitle}
            value={result?.value ?? "…"}
            details={result?.details}
            status={result?.status}
          />
        )}
        {tool === "calorie-calculator" && (
          <div className="flex flex-col gap-8">
            <Text>{copy.tools["calorie-calculator"].explainer}</Text>
            <Text tone="muted">{copy.tools["calorie-calculator"].method}</Text>
          </div>
        )}
      </div>
      {plan && plans[plan] && (
        <section
          aria-labelledby="plan-title"
          className="flex flex-col gap-16 lg:col-span-5 lg:col-start-8"
        >
          <Heading as="h2" variant="h2" id="plan-title">
            {copy.recommendTitle}
          </Heading>
          {tool === "calorie-calculator" && result?.goal === "lose" && (
            <Text>{copy.tools["calorie-calculator"].recommendLose}</Text>
          )}
          {/* Room for the featured card, which sits 24 px higher on desktop. */}
          <div className="lg:pt-24">{plans[plan]}</div>
        </section>
      )}
    </div>
  );
}

function choiceLabel(copy: Copy, field: ToolField, value: string): string {
  if (field === "sex") return copy.fields.sexes[value as Sex];
  if (field === "activity") return copy.fields.activities[value as Activity];
  return copy.fields.goals[value as Goal];
}
