import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap, { PUBLIC_PATHS } from "./sitemap";

describe("sitemap.xml", () => {
  it("lists every public page once, with its Telugu alternate", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(PUBLIC_PATHS.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    const programsPage = entries.find((entry) => entry.url.endsWith("/programs"));
    expect(programsPage?.alternates?.languages?.te).toMatch(/\/te\/programs$/);
    expect(entries.some((entry) => entry.url.endsWith("/programs/mass-builder"))).toBe(true);
    expect(entries.some((entry) => entry.url.endsWith("/tools/telugu-plate"))).toBe(true);
  });

  it("never lists a private route", () => {
    const [rule] = [robots().rules].flat();
    const blocked = [rule?.disallow ?? []].flat();

    for (const path of PUBLIC_PATHS) {
      expect(blocked.some((prefix) => path.startsWith(prefix))).toBe(false);
    }
  });

  it("is announced in robots.txt", () => {
    expect(robots().sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
