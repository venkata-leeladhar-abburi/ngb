import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Inner pages built from pages.md (Phase 6), in both languages. */
const ROUTES = [
  "/faq",
  "/about",
  "/transformations",
  "/programs/mass-builder",
  "/programs/shred-12",
  "/tools",
  "/tools/calorie-calculator",
  "/tools/bmi",
  "/tools/telugu-plate",
  "/start",
  "/quiz",
  "/workouts",
  "/club",
  "/coaching",
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

test.describe("free tools", () => {
  test("the calorie calculator shows a known result and keeps it on reload", async ({ page }) => {
    await page.goto("/tools/calorie-calculator");
    await expect(page.getByRole("button", { name: "Show my number" })).toBeEnabled();

    await page.getByLabel("Age", { exact: true }).fill("22");
    await page.getByLabel("Gender").selectOption("male");
    await page.getByLabel("Height (cm)").fill("172");
    await page.getByLabel("Weight (kg)").fill("70");
    await page.getByLabel("Activity").selectOption("train");
    await page.getByLabel("Goal").selectOption("lose");
    await page.getByRole("button", { name: "Show my number" }).click();

    // Mifflin-St Jeor: (700 + 1075 - 110 + 5) x 1.55 = 2588.5, shown to the nearest 10.
    await expect(page.getByText("2,590 kcal")).toBeVisible();
    await expect(page.getByText("Protein: 112 g a day.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shred 12" })).toBeVisible();
    await expect(page).toHaveURL(/age=22&sex=male&h=172&w=70&act=train&goal=lose/);

    await page.reload();
    await expect(page.getByText("2,590 kcal")).toBeVisible();
    await expect(page.getByLabel("Weight (kg)")).toHaveValue("70");
  });

  test("the calculator names what is missing and moves focus there", async ({ page }) => {
    await page.goto("/tools/bmi");
    await expect(page.getByRole("button", { name: "Show my number" })).toBeEnabled();

    await page.getByLabel("Height (cm)").fill("172");
    await page.getByLabel("Weight (kg)").fill("500");
    await page.getByRole("button", { name: "Show my number" }).click();

    await expect(page.getByText("Enter a weight between 30 and 200 kg.")).toBeVisible();
    await expect(page.getByLabel("Weight (kg)")).toBeFocused();
    await expect(page.getByLabel("Weight (kg)")).toHaveAttribute("aria-invalid", "true");
  });

  test("BMI uses the Asian healthy range", async ({ page }) => {
    await page.goto("/tools/bmi?h=172&w=66.3");

    await expect(page.getByText("22.4", { exact: true })).toBeVisible();
    await expect(page.getByText(/healthy range is 55 to 68 kg/)).toBeVisible();
    await expect(page.getByText("In the healthy range")).toBeVisible();
  });

  test("Telugu Plate counts protein as foods are added", async ({ page }) => {
    await page.goto("/tools/telugu-plate");
    const add = page.getByRole("button", { name: "Add one Boiled egg" });
    await expect(add).toBeEnabled();

    await add.click();
    await add.click();
    await page.getByRole("button", { name: "Add one Pappu (toor dal)" }).click();
    await expect(page.getByText("19 g", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/egg=2&pappu=1/);

    // A half-typed weight is not judged; the target appears once the field is left.
    const weight = page.getByLabel("Weight (kg)");
    await weight.pressSequentially("7");
    await expect(page.getByText("Enter a weight between 30 and 200 kg.")).toBeHidden();
    await weight.pressSequentially("0");
    await weight.press("Enter");
    await expect(page.getByText("Your target: 112 g. You need 93 g more.")).toBeVisible();

    await page.getByRole("button", { name: "Remove one Boiled egg" }).click();
    await expect(page.getByText("13 g", { exact: true })).toBeVisible();
  });

  test("Telugu Plate keeps keyboard focus when a count reaches zero", async ({ page }) => {
    await page.goto("/tools/telugu-plate?egg=1");
    const remove = page.getByRole("button", { name: "Remove one Boiled egg" });
    await expect(page.getByText("6 g", { exact: true })).toBeVisible();

    await remove.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("0 g", { exact: true })).toBeVisible();
    await expect(remove).toBeFocused();
    await expect(remove).toHaveAttribute("aria-disabled", "true");
  });

  test("the hub links only to tools that exist", async ({ page }) => {
    await page.goto("/tools");

    const links = page.getByRole("main").getByRole("link");
    await expect(links).toHaveCount(5);
    for (const href of await links.evaluateAll((all) => all.map((a) => a.getAttribute("href")))) {
      const response = await page.request.get(href ?? "/missing");
      expect(response.status(), href ?? "").toBe(200);
    }
  });
});

test.describe("find my plan", () => {
  test("the start page offers the three choices", async ({ page }) => {
    await page.goto("/start");

    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Find my plan (1 minute)" })).toHaveAttribute(
      "href",
      "/quiz",
    );
    await expect(main.getByRole("link", { name: "Try free tools" })).toHaveAttribute(
      "href",
      "/tools",
    );
    await expect(main.getByRole("link", { name: "See all programs" })).toHaveAttribute(
      "href",
      "/programs",
    );
  });

  test("four answers by keyboard end on one program", async ({ page }) => {
    await page.goto("/quiz");
    const next = page.getByRole("button", { name: "Next" });
    await expect(next).toBeEnabled();

    // Next with no answer names the problem instead of moving on.
    await next.click();
    await expect(page.getByText("Please pick one answer.")).toBeVisible();

    for (const answer of ["Gain weight", "Gym", "6 months or more"]) {
      await page.getByRole("radio", { name: answer }).focus();
      await page.keyboard.press("Space");
      await next.focus();
      await page.keyboard.press("Enter");
    }
    await expect(page.getByText("Question 4 of 4")).toBeVisible();
    await page.getByRole("radio", { name: "Non-veg" }).check();
    await page.getByRole("switch", { name: "I eat in a hostel or mess" }).click();
    await page.getByRole("button", { name: "See my plan" }).click();

    await expect(
      page.getByRole("heading", { name: "Your plan: Mass Builder (hostel version)" }),
    ).toBeVisible();
    await expect(page.getByText("This plan is built for exactly that.")).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Start my plan" }),
    ).toHaveAttribute("href", "/programs/mass-builder");
    await expect(page).toHaveURL(/goal=gain&place=gym&level=over6&food=nonveg&hostel=1/);

    // The result survives a reload, and Start again clears it.
    await page.reload();
    await expect(page.getByRole("heading", { name: /^Your plan: Mass Builder/ })).toBeVisible();
    await page.getByRole("button", { name: "Start again" }).click();
    await expect(page.getByText("Question 1 of 4")).toBeVisible();
  });

  test("someone who has never trained gets Foundation Plan", async ({ page }) => {
    await page.goto("/quiz?goal=lose&place=home&level=never&food=veg");

    await expect(page.getByRole("heading", { name: "Your plan: Foundation Plan" })).toBeVisible();
  });
});

test("Workouts filters by muscle group and keeps the choice in the URL", async ({ page }) => {
  await page.goto("/workouts");
  const groups = page.getByRole("main").getByRole("heading", { level: 2 });
  await expect(groups.filter({ visible: true })).toHaveCount(7);

  await page.getByRole("radio", { name: "Legs" }).click();
  await expect(page).toHaveURL(/\/workouts\?group=legs$/);
  await expect(groups.filter({ visible: true })).toHaveText(["Legs"]);

  // The one locked card the docs define leads to its program.
  await page.getByRole("radio", { name: "Chest" }).click();
  await expect(page.getByRole("link", { name: /Full chest plan/ })).toHaveAttribute(
    "href",
    "/programs/mass-builder",
  );
  // Videos that do not exist yet are not links.
  await expect(page.locator("#chest").getByRole("link")).toHaveCount(1);
});

test("Club shows both prices and its own button", async ({ page }) => {
  await page.goto("/club");

  const prices = page.getByRole("list", { name: "Club prices" });
  await expect(prices).toContainText("₹499");
  await expect(prices).toContainText("₹3,999");
  await expect(page.getByRole("main").getByRole("link", { name: "Join the Club" })).toHaveAttribute(
    "href",
    "/checkout/club",
  );
});

test("the coaching form is switched off until it has somewhere to post", async ({ page }) => {
  await page.goto("/coaching");

  const form = page.getByRole("form", { name: "Apply for 1:1 Coaching" });
  await expect(form.getByText("Applications are not open yet.")).toBeVisible();
  await expect(form.getByRole("button", { name: "Apply for 1:1" })).toBeDisabled();
  await expect(form.getByLabel("WhatsApp number")).toBeDisabled();
  expect(await form.getAttribute("action")).toBeNull();
});
