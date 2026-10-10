import { describe, expect, it } from "vitest";

import { MemoryRateLimiter } from "./rateLimit";

describe("MemoryRateLimiter", () => {
  it("allows up to the limit in a window, then refuses, then resets", async () => {
    let time = 0;
    const limiter = new MemoryRateLimiter(() => new Date(time));

    expect(await limiter.hit("k", 2, 60)).toEqual({ allowed: true, count: 1 });
    expect(await limiter.hit("k", 2, 60)).toEqual({ allowed: true, count: 2 });
    expect(await limiter.hit("k", 2, 60)).toEqual({ allowed: false, count: 3 });
    // Another key is counted on its own.
    expect((await limiter.hit("other", 2, 60)).allowed).toBe(true);

    time = 60_000;
    expect(await limiter.hit("k", 2, 60)).toEqual({ allowed: true, count: 1 });
  });
});
