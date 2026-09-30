import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

/**
 * Visual regression for every Storybook story (playbook section 8). A story whose look changes fails
 * until a person reviews the diff and approves it with `pnpm --filter @ngb/e2e visual:update`.
 * Never update snapshots just to make CI pass (.claude/rules/ui.md).
 */
interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: string;
}

const index = JSON.parse(
  readFileSync(new URL("../../packages/ui/storybook-static/index.json", import.meta.url), "utf8"),
) as { entries: Record<string, IndexEntry> };

const stories = Object.values(index.entries).filter((entry) => entry.type === "story");

for (const story of stories) {
  test(`${story.title} / ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?viewMode=story&id=${story.id}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Let play functions (open dialogs, toasts) settle.
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${story.id}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      // Absolute, not a ratio: a small component is under 1% of the page, so a ratio would miss real changes.
      maxDiffPixels: 20,
    });
  });
}
