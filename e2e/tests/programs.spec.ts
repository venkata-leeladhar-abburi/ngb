import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** The programs page in both languages (Phase 6, screen B1). */
for (const path of ["/programs", "/te/programs"] as const) {
  test.describe(`programs ${path}`, () => {
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

test("the filter keeps its choice in the URL and hides the plans that do not fit", async ({
  page,
}) => {
  await page.goto("/programs");
  const cards = page.locator("#programs article");
  await expect(cards.filter({ visible: true })).toHaveCount(4);

  await page.getByRole("radio", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/programs\?fit=home$/);
  await expect(page.getByRole("status")).toHaveText("Plans shown: 2");
  await expect(cards.filter({ visible: true })).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Master the Bodyweight" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mass Builder" })).toBeHidden();

  await page.reload();
  await expect(page.getByRole("radio", { name: "Home" })).toBeChecked();
  await expect(cards.filter({ visible: true })).toHaveCount(2);

  await page.getByRole("radio", { name: "All" }).click();
  await expect(page).toHaveURL(/\/programs$/);
  await expect(cards.filter({ visible: true })).toHaveCount(4);
});

test("the compare table names every value and links each plan", async ({ page }) => {
  await page.goto("/programs");

  const table = page.getByRole("table", { name: "Compare the plans" });
  await expect(table.getByRole("columnheader")).toHaveCount(4);
  await expect(table.getByRole("row", { name: /^Minutes per session/ })).toContainText("60");
  await expect(table.getByRole("link", { name: "Start my plan: Mass Builder" })).toHaveAttribute(
    "href",
    "/programs/mass-builder",
  );
});

test("the header marks Programs as the current page", async ({ page, isMobile }) => {
  test.skip(isMobile, "the phone header keeps its links inside the menu");
  await page.goto("/programs");

  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Programs" }),
  ).toHaveAttribute("aria-current", "page");
});
