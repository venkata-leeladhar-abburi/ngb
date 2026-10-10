import { describe, expect, it } from "vitest";

import { maskPhone, parseIndianMobile } from "./phone";

describe("parseIndianMobile", () => {
  it("accepts a 10-digit mobile however it is typed", () => {
    for (const input of [
      "9876543210",
      "98765 43210",
      "+919876543210",
      "+91 98765-43210",
      "919876543210",
      "09876543210",
      "(98765) 43210",
    ]) {
      expect(parseIndianMobile(input), input).toBe("+919876543210");
    }
  });

  it("rejects numbers that are not Indian mobiles", () => {
    for (const input of ["", "12345", "5876543210", "98765432101", "+14155550123", "98765abc10"]) {
      expect(parseIndianMobile(input), input).toBeNull();
    }
  });
});

describe("maskPhone", () => {
  it("keeps the country code and the last two digits", () => {
    expect(maskPhone("+919876543210")).toBe("+91********10");
  });
});
