import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots.txt", () => {
  it("keeps checkout, welcome, member and API routes out of search", () => {
    const [rule] = [robots().rules].flat();

    expect(rule?.allow).toBe("/");
    expect(rule?.disallow).toEqual(
      expect.arrayContaining(["/checkout", "/welcome", "/account", "/api"]),
    );
  });
});
