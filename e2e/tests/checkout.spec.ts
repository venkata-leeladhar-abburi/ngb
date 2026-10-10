import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Checkout steps 1 and 2 (Phase 7, screen B6): phone, code, then the pay step. The server runs with
 * local stand-ins, so codes land in an outbox file instead of an SMS.
 */
const OUTBOX = fileURLToPath(new URL("../../apps/web/.data/sms-outbox.jsonl", import.meta.url));

/** A phone number no other test or earlier run has used. */
const freshPhone = () =>
  `9${String(Date.now()).slice(-6)}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

/** The last code "sent" to a phone, read from the local outbox. */
async function codeFor(phone: string): Promise<string> {
  let found: string | undefined;
  await expect
    .poll(async () => {
      const lines = (await readFile(OUTBOX, "utf8").catch(() => "")).trim().split("\n");
      found = lines
        .filter(Boolean)
        .map((line) => JSON.parse(line) as { phone: string; code: string })
        .findLast((message) => message.phone === `+91${phone}`)?.code;
      return found;
    })
    .toMatch(/^\d{6}$/);
  return found ?? "";
}

async function sendCode(page: Page, phone: string) {
  await page.goto("/checkout/mass-builder");
  await page.getByLabel("Your phone number").fill(phone);
  await page.getByRole("button", { name: "Send code" }).click();
  await expect(page.getByText(`We sent a code to ${phone}.`)).toBeVisible();
}

for (const path of ["/checkout/mass-builder", "/te/checkout/mass-builder"]) {
  test.describe(`checkout ${path}`, () => {
    test("is private, uncached and accessible", async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      expect(response?.headers()["cache-control"]).toContain("no-store");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  });
}

test("shows the price from the server and takes a visitor from phone to the pay step", async ({
  page,
  context,
}) => {
  const phone = freshPhone();
  await sendCode(page, phone);
  await expect(page.getByText("Paying for: Mass Builder, 12 weeks, ₹1,999")).toBeVisible();

  await page
    .getByLabel("6-digit code")
    .first()
    .fill(await codeFor(phone));
  await expect(page.getByText(`Signed in as ${phone}.`)).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay ₹1,999" })).toBeDisabled();

  // The session cookie cannot be read by scripts and only travels over HTTPS (or localhost).
  const session = (await context.cookies()).find((cookie) => cookie.name === "ngb_session");
  expect(session).toMatchObject({ httpOnly: true, secure: true, sameSite: "Lax" });

  // Coming back, the visitor is still signed in and starts at the pay step, phone masked.
  await page.reload();
  await expect(page.getByText(`Signed in as +91********${phone.slice(-2)}.`)).toBeVisible();
  await expect(page.getByText("Step 3 of 3")).toBeVisible();
});

test("a wrong code says so, clears the boxes and still lets the right one in", async ({ page }) => {
  const phone = freshPhone();
  await sendCode(page, phone);
  const code = await codeFor(phone);

  const boxes = page.getByLabel("6-digit code").first();
  await boxes.fill(code === "000000" ? "000001" : "000000");
  await expect(
    page.getByText("That code didn't match. Check the SMS and try again."),
  ).toBeVisible();
  await expect(boxes).toHaveValue("");
  await expect(boxes).toBeFocused();

  await boxes.fill(code);
  await expect(page.getByText("Step 3 of 3")).toBeVisible();
});

test("names a phone number that is not valid", async ({ page }) => {
  await page.goto("/checkout/mass-builder");
  await page.getByLabel("Your phone number").fill("12345");
  await page.getByRole("button", { name: "Send code" }).click();

  await expect(page.getByText("Enter a 10-digit mobile number.")).toBeVisible();
  await expect(page.getByLabel("Your phone number")).toHaveAttribute("aria-invalid", "true");
});

test("refuses a fourth code to the same number", async ({ page }) => {
  const phone = freshPhone();
  await sendCode(page, phone);
  const resend = page.getByRole("button", { name: "Send a new code" });
  await resend.click();
  await expect(resend).toBeEnabled();
  await resend.click();
  await expect(resend).toBeEnabled();
  await resend.click();

  await expect(page.getByText("Too many codes sent to this number.")).toBeVisible();
});

test("the login API rejects cross-site posts and unknown fields", async ({ request, baseURL }) => {
  const send = (headers: Record<string, string>, data: unknown) =>
    request.post("/api/otp/send", { headers, data });

  const crossSite = await send({ origin: "https://evil.example" }, { phone: "9876543210" });
  expect(crossSite.status()).toBe(403);

  const unknownField = await send({ origin: baseURL ?? "" }, { phone: "9876543210", admin: true });
  expect(unknownField.status()).toBe(400);
  expect(await unknownField.json()).toEqual({
    error: { code: "invalid_request", message: "The request is not valid." },
  });
});

test("an unknown program has no checkout", async ({ page }) => {
  const response = await page.goto("/checkout/not-a-program");

  expect(response?.status()).toBe(404);
});
