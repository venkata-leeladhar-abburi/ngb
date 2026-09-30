import { describe, expect, it } from "vitest";

import { isResultFilter, resultQuery } from "./resultFilter";

describe("results filter URL", () => {
  it("writes the chosen filter to ?result= and keeps other parameters", () => {
    expect(resultQuery("", "lost")).toBe("?result=lost");
    expect(resultQuery("?utm_source=instagram", "women")).toBe(
      "?utm_source=instagram&result=women",
    );
    expect(resultQuery("?result=lost", "home")).toBe("?result=home");
  });

  it("removes the parameter for All", () => {
    expect(resultQuery("?result=lost", "all")).toBe("");
    expect(resultQuery("?utm_source=instagram&result=lost", "all")).toBe("?utm_source=instagram");
  });

  it("accepts only known filters from the URL", () => {
    expect(isResultFilter("gained")).toBe(true);
    expect(isResultFilter("everything")).toBe(false);
    expect(isResultFilter(null)).toBe(false);
  });
});
