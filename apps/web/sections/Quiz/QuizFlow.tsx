"use client";

import { Button, Heading, ProgressSteps, RadioGroup, Text, Toggle } from "@ngb/ui";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { ProgramSlug } from "@/content/catalog";
import type { Content } from "@/content";
import { fill } from "@/lib/format";
import { QUIZ, QUIZ_STEPS, isAnswer, isComplete, pickProgram, readAnswers } from "@/lib/quiz";

import { useUrlQuery } from "../shared/useUrlChoice";

interface QuizFlowProps {
  copy: Content["quiz"];
  /** Program names and cards, rendered on the server; the result shows one. */
  programs: Partial<Record<ProgramSlug, { name: string; card: ReactNode }>>;
}

/**
 * Find my plan (pages.md: Find my plan quiz): four questions, one at a time, ending on one program.
 * Answers live in the URL, so back and refresh keep your place in the Instagram browser. Choosing an
 * answer never moves on by itself (arrow keys select in a radio group); "Next" does.
 */
export function QuizFlow({ copy, programs }: QuizFlowProps) {
  const [search, replaceQuery] = useUrlQuery();
  const params = new URLSearchParams(search);
  const answers = readAnswers(params);
  const stepIndex = QUIZ_STEPS.findIndex((step) => answers[step] === undefined);
  const step = QUIZ_STEPS[stepIndex];

  const [choice, setChoice] = useState("");
  const [hostel, setHostel] = useState(false);
  const [error, setError] = useState(false);
  // After a step change, focus goes to the new step (or the result), so keyboard and screen-reader
  // users land on what changed. Not on first load.
  const stage = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (moved.current) stage.current?.focus();
  }, [stepIndex]);

  const go = (next: URLSearchParams) => {
    moved.current = true;
    setChoice("");
    setError(false);
    replaceQuery(next.toString());
  };

  if (isComplete(answers)) {
    const program = programs[pickProgram(answers)];
    if (!program) return null;
    const withHostel = params.get("hostel") === "1";
    const name = withHostel ? fill(copy.hostelVersion, { program: program.name }) : program.name;
    const exampleCase = answers.goal === "gain" && answers.place === "gym" && withHostel;
    const restart = new URLSearchParams(search);
    for (const key of [...QUIZ_STEPS, "hostel"]) restart.delete(key);
    return (
      <div ref={stage} tabIndex={-1} className="flex flex-col items-start gap-32 outline-hidden">
        <div className="flex flex-col gap-16">
          <Heading as="h2" variant="h2">
            {fill(copy.result, { program: name })}
          </Heading>
          <Text variant="lead" className="max-w-(--container-lead)">
            {exampleCase ? copy.whyGainGymHostel : copy.whyMissing}
          </Text>
        </div>
        <div className="w-full max-w-(--container-lead) lg:pt-24">{program.card}</div>
        <Button
          as="button"
          variant="secondary"
          onClick={() => {
            go(restart);
          }}
        >
          {copy.again}
        </Button>
      </div>
    );
  }

  if (!step) return null;
  const question = copy.questions[step];
  const last = stepIndex === QUIZ_STEPS.length - 1;

  const next = () => {
    if (!isAnswer(step, choice)) {
      setError(true);
      return;
    }
    const query = new URLSearchParams(search);
    query.set(step, choice);
    if (last && hostel) query.set("hostel", "1");
    go(query);
  };

  const back = () => {
    const previous = QUIZ_STEPS[stepIndex - 1];
    if (!previous) return;
    const query = new URLSearchParams(search);
    query.delete(previous);
    go(query);
  };

  return (
    <div className="flex max-w-(--container-lead) flex-col gap-32">
      <ProgressSteps
        label={copy.progressLabel}
        steps={QUIZ_STEPS.map((name) => copy.steps[name])}
        current={stepIndex}
        doneLabel={copy.done}
        counter={(current, total) => fill(copy.counter, { step: current, total })}
      />
      <div ref={stage} tabIndex={-1} className="flex flex-col gap-24 outline-hidden">
        <RadioGroup
          key={step}
          label={question.question}
          options={QUIZ[step].map((value) => ({
            value,
            label: (question.answers as Record<string, string>)[value] ?? value,
          }))}
          value={choice}
          onValueChange={(value) => {
            setChoice(value);
            setError(false);
          }}
          required
          error={error ? copy.error : undefined}
        />
        {last && <Toggle label={copy.hostel} checked={hostel} onCheckedChange={setHostel} />}
      </div>
      <div className="flex flex-wrap gap-16">
        {stepIndex > 0 && (
          <Button as="button" variant="secondary" onClick={back}>
            {copy.back}
          </Button>
        )}
        <Button as="button" onClick={next}>
          {last ? copy.see : copy.next}
        </Button>
      </div>
    </div>
  );
}
