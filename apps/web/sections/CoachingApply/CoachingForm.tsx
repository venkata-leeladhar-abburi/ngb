"use client";

import { Button, Select, Text, TextField } from "@ngb/ui";

import type { Content } from "@/content";

type Options = readonly { value: string; label: string }[];

interface CoachingFormProps {
  copy: Content["coaching"];
  goals: Options;
  levels: Options;
}

/**
 * The 1:1 application form (pages.md: 1:1 Coaching), switched off: the fieldset is disabled and the
 * form has no action, so nothing typed here can be sent or stored until lead capture exists (Phase 7).
 */
export function CoachingForm({ copy, goals, levels }: CoachingFormProps) {
  const fields = copy.fields;
  return (
    <form aria-label={copy.formLabel} className="lg:col-span-6 lg:col-start-7">
      <fieldset disabled className="grid gap-24 md:grid-cols-2">
        <Text className="md:col-span-2">{copy.notOpen}</Text>
        <TextField name="name" label={fields.name} autoComplete="name" />
        <TextField
          name="phone"
          label={fields.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <TextField name="city" label={fields.city} autoComplete="address-level2" />
        <Select name="goal" label={fields.goal} placeholder={fields.choose} options={goals} />
        <TextField name="weight" label={fields.weight} inputMode="decimal" autoComplete="off" />
        <Select
          name="experience"
          label={fields.experience}
          placeholder={fields.choose}
          options={levels}
        />
        <TextField name="why" label={fields.why} className="md:col-span-2" />
        <Button as="button" type="submit" disabled className="md:justify-self-start">
          {copy.apply}
        </Button>
      </fieldset>
    </form>
  );
}
