import { describe, expect, it } from "vitest";

import { isComplete, pickProgram, readAnswers, type QuizAnswers } from "./quiz";

const answers = (override: Partial<QuizAnswers> = {}): QuizAnswers => ({
  goal: "gain",
  place: "gym",
  level: "over6",
  food: "nonveg",
  ...override,
});

describe("quiz result", () => {
  it("matches the pages.md example: gain weight at a gym is Mass Builder", () => {
    expect(pickProgram(answers())).toBe("mass-builder");
    expect(pickProgram(answers({ goal: "stronger", place: "both" }))).toBe("mass-builder");
  });

  it("sends fat loss and lean goals to Shred 12", () => {
    expect(pickProgram(answers({ goal: "lose" }))).toBe("shred-12");
    expect(pickProgram(answers({ goal: "lean", place: "both" }))).toBe("shred-12");
  });

  it("sends home training to Master the Bodyweight, whatever the goal", () => {
    expect(pickProgram(answers({ place: "home" }))).toBe("master-the-bodyweight");
    expect(pickProgram(answers({ goal: "lose", place: "home" }))).toBe("master-the-bodyweight");
  });

  it("starts anyone who has never trained on Foundation Plan", () => {
    expect(pickProgram(answers({ level: "never" }))).toBe("foundation-plan");
    expect(pickProgram(answers({ level: "never", place: "home", goal: "lose" }))).toBe(
      "foundation-plan",
    );
  });
});

describe("quiz answers in the URL", () => {
  it("reads answers in order and stops at the first gap", () => {
    expect(readAnswers(new URLSearchParams("goal=gain&place=gym"))).toEqual({
      goal: "gain",
      place: "gym",
    });
    expect(readAnswers(new URLSearchParams("place=gym&level=never"))).toEqual({});
    expect(readAnswers(new URLSearchParams("goal=fly&place=gym"))).toEqual({});
  });

  it("knows when all four are answered", () => {
    const all = readAnswers(new URLSearchParams("goal=lose&place=both&level=under6&food=veg"));
    expect(isComplete(all)).toBe(true);
    expect(isComplete(readAnswers(new URLSearchParams("goal=lose")))).toBe(false);
  });
});
