import { describe, expect, it } from "vitest";

import { formatInr } from "./format";

describe("formatInr", () => {
  it("uses the rupee sign and Indian grouping", () => {
    expect(formatInr(1999)).toBe("₹1,999");
    expect(formatInr(100000)).toBe("₹1,00,000");
  });
});
