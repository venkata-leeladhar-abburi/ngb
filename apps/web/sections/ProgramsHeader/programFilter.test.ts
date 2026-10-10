import { describe, expect, it } from "vitest";

import { programs } from "@/content/catalog";

import { fitsFilter, isProgramFilter, programQuery, type ProgramFilter } from "./programFilter";

const shown = (filter: ProgramFilter) =>
  programs.filter((program) => fitsFilter(program, filter)).map((program) => program.slug);

describe("programs filter", () => {
  it("shows every program for All and for Hostel-friendly (home.md §10)", () => {
    expect(shown("all")).toHaveLength(4);
    expect(shown("hostel")).toHaveLength(4);
  });

  it("puts the home-or-gym plan under both Gym and Home", () => {
    expect(shown("gym")).toEqual(["foundation-plan", "shred-12", "mass-builder"]);
    expect(shown("home")).toEqual(["foundation-plan", "master-the-bodyweight"]);
  });

  it("shows only the first plan for Beginner", () => {
    expect(shown("beginner")).toEqual(["foundation-plan"]);
  });

  it("writes the choice to ?fit= and keeps other parameters", () => {
    expect(programQuery("", "gym")).toBe("?fit=gym");
    expect(programQuery("?utm_source=instagram", "home")).toBe("?utm_source=instagram&fit=home");
    expect(programQuery("?utm_source=instagram&fit=home", "all")).toBe("?utm_source=instagram");
  });

  it("accepts only known filters from the URL", () => {
    expect(isProgramFilter("beginner")).toBe(true);
    expect(isProgramFilter("cheap")).toBe(false);
    expect(isProgramFilter(null)).toBe(false);
  });
});
