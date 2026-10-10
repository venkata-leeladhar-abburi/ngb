import { describe, expect, it } from "vitest";

import { bmi, healthyWeightRange, isHealthyBmi } from "./bmi";
import { dailyCalories, restingCalories, weightGainCalories } from "./calories";
import { proteinTarget } from "./protein";
import { MAX_PORTIONS, PLATE_FOODS, plateProtein } from "./teluguPlate";
import { readNumber } from "./validate";

const man = { sex: "male", age: 22, heightCm: 172, weightKg: 70 } as const;
const woman = { sex: "female", age: 25, heightCm: 160, weightKg: 55 } as const;

describe("calories (Mifflin-St Jeor)", () => {
  it("gives resting energy for a man and a woman", () => {
    // 10 x 70 + 6.25 x 172 - 5 x 22 + 5
    expect(restingCalories(man)).toBe(1670);
    // 10 x 55 + 6.25 x 160 - 5 x 25 - 161
    expect(restingCalories(woman)).toBe(1264);
  });

  it("multiplies by activity and rounds to 10 kcal", () => {
    expect(dailyCalories(man, "sitting")).toBe(2000); // 2004
    expect(dailyCalories(man, "light")).toBe(2300); // 2296.25
    expect(dailyCalories(man, "train")).toBe(2590); // 2588.5
    expect(dailyCalories(man, "active")).toBe(2880); // 2880.75
    expect(dailyCalories(woman, "sitting")).toBe(1520); // 1516.8
  });

  it("adds 300 kcal to gain weight", () => {
    expect(weightGainCalories(man, "train")).toBe(2890);
  });
});

describe("protein target", () => {
  it("is about 1.6 g per kg", () => {
    expect(proteinTarget(69)).toBe(110); // pages.md example
    expect(proteinTarget(72)).toBe(115);
    expect(proteinTarget(50)).toBe(80);
  });
});

describe("BMI with Asian cut-offs", () => {
  it("matches the pages.md example: 22.4 at 172 cm, healthy range 55 to 68 kg", () => {
    expect(bmi(66.3, 172)).toBe(22.4);
    expect(healthyWeightRange(172)).toEqual({ minKg: 55, maxKg: 68 });
  });

  it("treats 18.5 to 22.9 as healthy", () => {
    expect(isHealthyBmi(18.5)).toBe(true);
    expect(isHealthyBmi(22.9)).toBe(true);
    expect(isHealthyBmi(18.4)).toBe(false);
    expect(isHealthyBmi(23)).toBe(false);
  });
});

describe("Telugu Plate", () => {
  it("lists the 14 foods from pages.md", () => {
    expect(PLATE_FOODS).toHaveLength(14);
  });

  it("adds protein per portion", () => {
    // 1 cup rice 4 + 1 katori pappu 7 + 1 katori perugu 4 + 2 eggs' curry 12 = 27
    expect(plateProtein({ rice: 1, pappu: 1, perugu: 1, "egg-curry": 1 })).toBe(27);
    expect(plateProtein({ egg: 3, perugu: 1 })).toBe(22);
    expect(plateProtein({})).toBe(0);
  });

  it("ignores negative counts and caps a food's portions", () => {
    expect(plateProtein({ egg: -2 })).toBe(0);
    expect(plateProtein({ egg: 999 })).toBe(MAX_PORTIONS * 6);
  });
});

describe("number fields", () => {
  it("accepts a value in range", () => {
    expect(readNumber("weight", "70")).toEqual({ value: 70 });
    expect(readNumber("weight", " 66.3 ")).toEqual({ value: 66.3 });
  });

  it("names the error for empty, non-numeric and out-of-range input", () => {
    expect(readNumber("weight", "")).toEqual({ error: "required" });
    expect(readNumber("weight", null)).toEqual({ error: "required" });
    expect(readNumber("weight", "abc")).toEqual({ error: "range" });
    expect(readNumber("weight", "29")).toEqual({ error: "range" });
    expect(readNumber("height", "221")).toEqual({ error: "range" });
    expect(readNumber("age", "12")).toEqual({ error: "range" });
  });
});
