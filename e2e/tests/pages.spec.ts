import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Inner pages built from pages.md (Phase 6), in both languages. */
const ROUTES = [
  "/faq",
  "/about",
  "/transformations",
  "/programs/mass-builder",
  "/programs/shred-12",
] as const;

for (const route of ROUTES) {
  for (const path of [route, `/te${route}`]) {
    test.describe(`page ${path}`, () => {
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
}

/** The JSON-LD blocks on a page, parsed. */
const jsonLd = (page: Page) =>
  page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent) as unknown));

test.describe("FAQ", () => {
  test("a group link moves to its group and an answer opens with the keyboard", async ({
    page,
  }) => {
    await page.goto("/faq");

    await page
      .getByRole("navigation", { name: "Question groups" })
      .getByRole("link", { name: "Payments" })
      .click();
    await expect(page).toHaveURL(/\/faq#payments-title$/);
    await expect(page.getByRole("heading", { level: 2, name: "Payments" })).toBeInViewport();

    const question = page.getByRole("button", { name: "Will I get a GST invoice?" });
    await expect(question).toHaveAttribute("aria-expanded", "false");
    await question.focus();
    await page.keyboard.press("Enter");
    await expect(question).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Yes, by email and WhatsApp.")).toBeVisible();
  });

  test("describes all 16 questions to search engines", async ({ page }) => {
    await page.goto("/faq");

    const [data] = (await jsonLd(page)) as [{ "@type": string; mainEntity: unknown[] }];
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(16);
  });
});

test("About describes Nawin and NGB Evolve to search engines", async ({ page }) => {
  await page.goto("/about");

  const [data] = (await jsonLd(page)) as [{ "@graph": { "@type": string }[] }];
  expect(data["@graph"].map((node) => node["@type"])).toEqual(["Person", "Organization"]);
  await expect(page.getByRole("main").getByRole("link", { name: "Start my plan" })).toHaveAttribute(
    "href",
    "/programs",
  );
});

test("Transformations keeps the filter in the URL", async ({ page }) => {
  await page.goto("/transformations");
  await expect(
    page.getByRole("list", { name: "Member results" }).getByRole("listitem"),
  ).toHaveCount(6);

  await page.getByRole("radio", { name: "Lost fat" }).click();
  await expect(page).toHaveURL(/\/transformations\?result=lost$/);
  await expect(page.getByText("No results in this group yet.")).toBeVisible();
});

test.describe("404", () => {
  for (const [path, home] of [
    ["/this-page-does-not-exist", "/"],
    ["/te/this-page-does-not-exist", "/te"],
  ] as const) {
    test(`${path} offers two ways back`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(404);
      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
      const links = main.getByRole("link");
      await expect(links).toHaveCount(2);
      await expect(links.first()).toHaveAttribute("href", home);
      await expect(links.last()).toHaveAttribute("href", `${home}#tools`);
    });
  }
});

test.describe("program detail", () => {
  test("sells one program with its price, per-day price and one way to buy", async ({ page }) => {
    await page.goto("/programs/mass-builder");

    const hero = page.locator("#program");
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Mass Builder");
    await expect(hero).toContainText("₹1,999");
    await expect(hero).toContainText("about ₹24 a day, lifetime access");
    await expect(hero.getByRole("link", { name: "Start my plan" })).toHaveAttribute(
      "href",
      "/checkout/mass-builder",
    );
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Programs" }),
    ).toHaveAttribute("href", "/programs");
  });

  test("describes the program to search engines", async ({ page }) => {
    await page.goto("/programs/shred-12");

    const [data] = (await jsonLd(page)) as [{ "@type": string; offers: { price: number } }];
    expect(data["@type"]).toBe("Product");
    expect(data.offers.price).toBe(1999);
  });

  test("an unknown program is a 404", async ({ page }) => {
    const response = await page.goto("/programs/not-a-program");

    expect(response?.status()).toBe(404);
  });
});
