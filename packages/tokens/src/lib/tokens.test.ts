import { describe, expect, it } from "vitest";

import { getToken, listTokens, loadTokens, referenceOf, resolve } from "./tokens.ts";

const tree = loadTokens(new URL("../tokens.json", import.meta.url));

describe("tokens.json", () => {
  it("resolves every reference", () => {
    for (const { path, token } of listTokens(tree)) {
      expect(() => resolve(tree, token.$value), path).not.toThrow();
    }
  });

  it("gives every token a type", () => {
    const untyped = listTokens(tree).filter(({ type }) => type === undefined);
    expect(untyped.map(({ path }) => path)).toEqual([]);
  });

  it("keeps raw colours in the primitive tier (semantic colours are references)", () => {
    const raw = listTokens(tree).filter(
      ({ path, type, token }) =>
        type === "color" &&
        !path.startsWith("primitive.") &&
        referenceOf(token.$value) === undefined,
    );
    expect(raw.map(({ path }) => path)).toEqual([]);
  });

  it("detects circular references", () => {
    const loop = { a: { $value: "{b}" }, b: { $value: "{a}" } };
    expect(() => resolve(loop, "{a}")).toThrow("Circular reference");
    expect(() => getToken(tree, "color.nope")).toThrow("Unknown token");
  });
});
