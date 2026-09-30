import { describe, expect, it } from "vitest";

import { perDayPrice } from "@ngb/ui";

import { programs, proofStats, smallTools } from "./catalog";
import en from "./en.json";
import { getContent, localePath, TODO_TE } from "./index";
import te from "./te.json";

/** Every leaf string with its dotted path. */
function leaves(node: unknown, path = ""): [string, unknown][] {
  if (Array.isArray(node)) return node.flatMap((value, i) => leaves(value, `${path}.${i}`));
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      leaves(value, path ? `${path}.${key}` : key),
    );
  }
  return [[path, node]];
}

describe("content", () => {
  it("has the same keys in English and Telugu", () => {
    expect(leaves(te).map(([path]) => path)).toEqual(leaves(en).map(([path]) => path));
  });

  it("marks unwritten Telugu visibly, never with English copy", () => {
    const english = new Map(leaves(en));
    const copied = leaves(te).filter(
      ([path, value]) =>
        value !== TODO_TE &&
        value === english.get(path) &&
        // Brand name and numbers are the same in both; Telugu lines already in the English version are fine.
        !/^site\.name$/.test(path) &&
        !/[\u0C00-\u0C7F]/.test(String(value)),
    );
    expect(copied).toEqual([]);
  });

  it("uses no em or en dashes in copy (voice.md)", () => {
    for (const [path, value] of [...leaves(en), ...leaves(te)]) {
      expect(`${path}: ${String(value)}`).not.toMatch(/[–—]/);
    }
  });

  it("has a label for every proof number", () => {
    expect(getContent("en").home.proof.stats).toHaveLength(proofStats.length);
  });

  it("has a line for every program and small tool in the catalog", () => {
    const { programs: copy, tools } = getContent("en").home;
    for (const program of programs) expect(copy.lines[program.slug]).toBeTruthy();
    for (const tool of smallTools) expect(tools.small[tool.slug].title).toBeTruthy();
  });

  it("builds localised paths", () => {
    expect(localePath("en", "/")).toBe("/");
    expect(localePath("te", "/")).toBe("/te");
    expect(localePath("te", "/programs")).toBe("/te/programs");
  });
});

describe("catalog", () => {
  it("prices match home.md §9, with the per-day price shown on every card", () => {
    expect(programs.map((p) => [p.slug, p.priceInr, perDayPrice(p.priceInr, p.weeks)])).toEqual([
      ["foundation-plan", 1499, 27],
      ["shred-12", 1999, 24],
      ["mass-builder", 1999, 24],
      ["master-the-bodyweight", 1499, 18],
    ]);
  });

  it("features exactly one program", () => {
    expect(programs.filter((p) => p.featured).map((p) => p.slug)).toEqual(["shred-12"]);
  });
});
