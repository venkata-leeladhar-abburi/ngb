import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";

import { build } from "./emit.ts";
import { loadTokens, type TokenTree } from "./tokens.ts";

const tree = loadTokens(new URL("../tokens.json", import.meta.url));
const { files, cssVars } = build(tree);

/** Runs the real Tailwind compiler on the generated theme and returns the CSS for the given classes. */
async function tailwind(classes: string[]): Promise<string> {
  const compiler = await compile(`${files["theme.css"]}\n@tailwind utilities;`);
  return compiler.build(classes);
}

describe("generated theme", () => {
  it("removes Tailwind's defaults so only tokens produce utilities", async () => {
    const css = await tailwind([
      "bg-red-500",
      "p-5",
      "shadow-lg",
      "text-xl",
      "rounded-lg",
      "font-sans",
    ]);
    expect(css).not.toMatch(/\.(bg-red-500|p-5|shadow-lg|text-xl|rounded-lg|font-sans)\b/);
  });

  it("creates the semantic utilities", async () => {
    const css = await tailwind([
      "bg-page",
      "text-primary",
      "border-strong",
      "p-16",
      "text-h1",
      "shadow-sells",
      "font-display",
      "max-w-content",
      "px-page",
      "rounded-card",
      "ease-out",
    ]);
    for (const cls of [
      "bg-page",
      "text-primary",
      "border-strong",
      "p-16",
      "text-h1",
      "shadow-sells",
      "font-display",
      "max-w-content",
      "px-page",
      "rounded-card",
      "ease-out",
    ]) {
      expect(css, cls).toContain(`.${cls}`);
    }
    expect(css).toContain("var(--spacing-16)");
  });

  it("keeps zero values working (inset-0, p-0, translate-y-0...)", async () => {
    const zero = [
      "inset-0",
      "inset-x-0",
      "top-0",
      "left-0",
      "bottom-0",
      "p-0",
      "m-0",
      "gap-0",
      "translate-y-0",
    ];
    const css = await tailwind(zero);
    for (const cls of zero) {
      expect(css, cls).toContain(`.${cls}`);
    }
  });

  it("allows each colour only in its role", async () => {
    const css = await tailwind(["text-page", "bg-muted", "border-page", "bg-primary"]);
    expect(css).not.toMatch(/\.(text-page|bg-muted|border-page|bg-primary)\b/);
  });

  it("never exposes primitive names or raw scale values outside the spacing scale", () => {
    expect(files["theme.css"]).not.toContain("primitive");
    expect(files["tokens.css"]).not.toContain("primitive");
  });

  it("lets next/font supply each family, falling back to the family name", () => {
    expect(files["theme.css"]).toContain(
      '--font-display: var(--font-rush-driver, "Rush Driver"), sans-serif;',
    );
    expect(files["theme.css"]).toContain(
      '--font-telugu-body: var(--font-noto-telugu, "Noto Sans Telugu"), sans-serif;',
    );
  });

  it("binds line height and tracking to the type roles", async () => {
    const theme = files["theme.css"];
    expect(theme).toContain("--text-mega--line-height: var(--leading-display);");
    expect(theme).toContain("--text-h1--line-height: var(--leading-heading);");
    expect(theme).toContain("--text-body--line-height: var(--leading-body);");
    expect(theme).toContain("--text-label--letter-spacing: var(--tracking-label);");
    const css = await tailwind(["text-label", "text-hero", "tracking-label", "leading-heading"]);
    expect(css).toContain("letter-spacing: var(--tw-tracking, var(--text-label--letter-spacing))");
    expect(css).toContain("line-height: var(--tw-leading, var(--text-hero--line-height))");
    expect(css).toContain(".tracking-label");
    expect(css).toContain(".leading-heading");
  });

  it("gives Telugu text room for vowel signs in every role", () => {
    const telugu = /:lang\(te\) \{([^}]*)\}/.exec(files["base.css"])?.[1] ?? "";
    for (const role of ["mega", "hero", "display", "h1", "body"]) {
      expect(telugu).toContain(`--text-${role}--line-height: var(--leading-telugu);`);
    }
    expect(telugu).toContain("--font-label: var(--font-telugu-heading);");
    expect(telugu).toContain("--font-display: var(--font-telugu-heading);");
    expect(telugu).toContain("--font-body: var(--font-telugu-body);");
    expect(telugu).toContain("--text-label--letter-spacing: normal;");
  });

  it("points component tokens at semantic variables", () => {
    expect(files["tokens.css"]).toContain("--button-primary-bg: var(--background-color-action);");
    expect(files["tokens.css"]).toContain("--program-card-featured-glow: var(--shadow-sells);");
    expect(cssVars["color.bg.page"]).toBe("--background-color-page");
  });

  it("fails the build when a token is never emitted", () => {
    const withOrphan: TokenTree = { ...tree, orphan: { $type: "number", $value: 1 } };
    expect(() => build(withOrphan)).toThrow("not emitted by the build: orphan");
  });

  it("reports every board 02 pair as passing in tokens.ts", () => {
    expect(files["tokens.ts"]).not.toContain('"passes": false');
  });
});
