import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("loads with one h1, English lang and a working skip link", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("has no WCAG 2.2 AA violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("renders with the NGB design tokens", async ({ page }) => {
    await page.goto("/");

    // color.bg.page (#0B0909) and color.text.primary (#EDE3D6) from packages/tokens.
    await expect(page.locator("html")).toHaveCSS("background-color", "rgb(11, 9, 9)");
    await expect(page.locator("h1")).toHaveCSS("color", "rgb(237, 227, 214)");
  });

  test("loads the brand body font, and no Telugu fonts on English pages", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator("body")).toHaveCSS("font-family", /^gtStandard/);
    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family),
    );
    expect(loaded.join(" ")).toContain("gtStandard");
    expect(loaded.join(" ")).not.toMatch(/anekTelugu|notoTelugu/);
  });

  test("sends the security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["strict-transport-security"]).toContain("max-age=63072000");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test("unknown pages return 404 with the not-found copy", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page skipped leg day.");
});

test("health endpoint is up and never cached", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toMatchObject({ status: "ok" });
});

test.describe("languages", () => {
  test("Telugu home is served at /te with lang te", async ({ page }) => {
    const response = await page.goto("/te");

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "te");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("/en redirects to the unprefixed English page", async ({ request }) => {
    const response = await request.get("/en", { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe("/");
  });

  test("unknown Telugu pages also return 404", async ({ page }) => {
    const response = await page.goto("/te/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
  });
});
