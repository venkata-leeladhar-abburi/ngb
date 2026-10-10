import { describe, expect, it } from "vitest";

import { fill, formatInr, formatNumber } from "./format";

describe("formatInr", () => {
  it("uses the rupee sign and Indian grouping", () => {
    expect(formatInr(1999)).toBe("₹1,999");
    expect(formatInr(100000)).toBe("₹1,00,000");
  });
});

describe("formatNumber", () => {
  it("groups the Indian way", () => {
    expect(formatNumber(2590)).toBe("2,590");
    expect(formatNumber(100000)).toBe("1,00,000");
  });
});

describe("fill", () => {
  it("fills named slots and leaves unknown ones visible", () => {
    expect(fill("Protein: {protein} g a day.", { protein: 115 })).toBe("Protein: 115 g a day.");
    expect(fill("{a} and {b}", { a: "x" })).toBe("x and {b}");
  });
});
