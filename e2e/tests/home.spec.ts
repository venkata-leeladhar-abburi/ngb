import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** The homepage in both languages (Phase 5, screens A1 to A7). */
for (const path of ["/", "/te"] as const) {
  test.describe(`homepage ${path}`, () => {
    test("has one h1 and headings that never skip a level", async ({ page }) => {
      await page.goto(path);

      const levels = await page
        .locator("main h1, main h2, main h3, main h4")
        .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName[1])));
      expect(levels.filter((level) => level === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      levels.forEach((level, index) => {
        expect(level - (levels[index - 1] ?? 1)).toBeLessThanOrEqual(1);
      });
    });

    test("has no WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test("never scrolls sideways", async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);

      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  });
}

test("the FAQ opens and closes with the keyboard", async ({ page }) => {
  await page.goto("/");

  const question = page.getByRole("button", { name: "Do I need supplements?" });
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("No. Food first.")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(question).toHaveAttribute("aria-expanded", "false");
});

test("the community marquee can be paused and played again", async ({ page }) => {
  await page.goto("/");

  const community = page.getByRole("region", { name: "Posts from the NGB community" });
  await community.getByRole("button", { name: "Pause" }).click();
  await expect(community.getByRole("button", { name: "Play" })).toBeVisible();
  await community.getByRole("button", { name: "Play" }).click();
  await expect(community.getByRole("button", { name: "Pause" })).toBeVisible();
});

test.describe("results filter", () => {
  test("writes the choice to the URL and keeps it on reload", async ({ page }) => {
    await page.goto("/#results");

    await page.getByRole("radio", { name: "Lost fat" }).click();
    await expect(page).toHaveURL(/\?result=lost/);
    await expect(page.getByText("No results in this group yet.")).toBeVisible();

    await page.reload();
    await expect(page.getByRole("radio", { name: "Lost fat" })).toBeChecked();

    await page.getByRole("radio", { name: "All" }).click();
    await expect(page).not.toHaveURL(/result=/);
    await expect(page.getByRole("region", { name: "Member results" })).toBeVisible();
  });

  test("ignores an unknown filter in the URL", async ({ page }) => {
    await page.goto("/?result=everything");

    await expect(page.getByRole("radio", { name: "All" })).toBeChecked();
  });
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the journey is never pinned and every manifesto line is visible", async ({ page }) => {
    await page.goto("/");
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await page.getByRole("heading", { name: "No fake flexing." }).scrollIntoViewIfNeeded();

    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.getByText("Shortcuts levu. Discipline undi.")).toHaveCSS("opacity", "1");
  });
});

test.describe("phone sticky bar", () => {
  test.skip(({ isMobile }) => !isMobile, "The bar exists below lg only.");

  test("hides over the hero, shows after it, and hides over the programs", async ({ page }) => {
    await page.goto("/");
    const bar = page.getByRole("complementary", { name: "Quick actions" });

    await expect(bar).toHaveAttribute("inert", "");
    await page.locator("#journey").scrollIntoViewIfNeeded();
    await expect(bar).not.toHaveAttribute("inert", "");
    await page.locator("#programs").scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute("inert", "");
  });

  test("never covers the last link on the page", async ({ page }) => {
    await page.goto("/");
    await page.locator("#journey").scrollIntoViewIfNeeded();

    const last = page.locator("footer a").last();
    await last.focus();
    const box = await last.boundingBox();
    const barTop = await page
      .getByRole("complementary", { name: "Quick actions" })
      .evaluate((bar) => bar.getBoundingClientRect().top);
    expect(box).not.toBeNull();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(barTop);
  });
});
