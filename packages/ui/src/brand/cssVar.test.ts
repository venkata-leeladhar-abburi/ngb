import { afterEach, describe, expect, it } from "vitest";

import { cssDuration, cssVar } from "./cssVar";

describe("cssVar", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("style");
  });

  it("reads a token's value from <html>", () => {
    document.documentElement.style.setProperty("--breakpoint-lg", " 64rem");
    expect(cssVar("--breakpoint-lg")).toBe("64rem");
  });

  it("turns duration tokens into milliseconds", () => {
    document.documentElement.style.setProperty("--motion-hero", "900ms");
    document.documentElement.style.setProperty("--motion-base", "0.25s");
    expect(cssDuration("--motion-hero")).toBe(900);
    expect(cssDuration("--motion-base")).toBe(250);
    expect(cssDuration("--motion-missing")).toBe(0);
  });
});
