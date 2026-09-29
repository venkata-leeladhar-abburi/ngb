// Subsets the font sources in apps/web/fonts/ into small woff2 files in apps/web/fonts/web/,
// and reports any character the copy needs that a font lacks.
//   pnpm --filter @ngb/web fonts            report + write
//   pnpm --filter @ngb/web fonts --check    report only
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

import * as fontkit from "fontkit";
import subsetFont from "subset-font";

const root = new URL("../", import.meta.url);
const sources = new URL("fonts/", root);
const output = new URL("fonts/web/", root);
const repo = new URL("../../", root);

interface FontJob {
  /** Output file in fonts/web/. */
  file: string;
  /** Source path inside fonts/. */
  source: string;
  family: string;
  weight: string;
  style: "normal" | "italic";
  script: "latin" | "telugu";
  variationAxes?: Record<string, number | { min: number; max: number }>;
}

/** The faces board 04 uses, and nothing more. */
export const FONTS: readonly FontJob[] = [
  {
    file: "rush-driver-italic.woff2",
    source: "rush-driver/RushDriver-Italic.otf",
    family: "Rush Driver",
    weight: "400",
    style: "italic",
    script: "latin",
  },
  {
    file: "gt-america-compressed-black-italic.woff2",
    source: "gt-america-font-family/GT-America-Compressed-Black-Italic-Trial.otf",
    family: "GT America Compressed",
    weight: "900",
    style: "italic",
    script: "latin",
  },
  {
    file: "gt-america-extended-bold.woff2",
    source: "gt-america-font-family/GT-America-Extended-Bold-Trial-1.otf",
    family: "GT America Extended",
    weight: "700",
    style: "normal",
    script: "latin",
  },
  {
    file: "gt-america-standard-regular.woff2",
    source: "gt-america-font-family/GT-America-Standard-Regular-Trial-1.otf",
    family: "GT America Standard",
    weight: "400",
    style: "normal",
    script: "latin",
  },
  {
    file: "gt-america-standard-bold.woff2",
    source: "gt-america-font-family/GT-America-Standard-Bold-Trial-1.otf",
    family: "GT America Standard",
    weight: "700",
    style: "normal",
    script: "latin",
  },
  {
    file: "gt-america-mono-regular.woff2",
    source: "gt-america-font-family/GT-America-Mono-Regular-Trial.otf",
    family: "GT America Mono",
    weight: "400",
    style: "normal",
    script: "latin",
  },
  {
    file: "anek-telugu-condensed-extrabold.woff2",
    source: "Anek_Telugu/static/AnekTelugu_Condensed-ExtraBold.ttf",
    family: "Anek Telugu",
    weight: "800",
    style: "normal",
    script: "telugu",
  },
  {
    file: "noto-sans-telugu.woff2",
    source: "Noto_Sans_Telugu/NotoSansTelugu-VariableFont_wdth,wght.ttf",
    family: "Noto Sans Telugu",
    weight: "400 600",
    style: "normal",
    script: "telugu",
    variationAxes: { wght: { min: 400, max: 600 }, wdth: 100 },
  },
];

const range = (from: number, to: number): string =>
  String.fromCodePoint(...Array.from({ length: to - from + 1 }, (_, i) => from + i));

/**
 * Splits text into Unicode code points. Fonts map code points to glyphs, so this (not grapheme
 * splitting) is the right unit for coverage checks.
 */
const codePoints = (text: string): string[] => Array.from(text);

const isTelugu = (char: string): boolean => /[ఀ-౿]/u.test(char);

function copyText(): string {
  const copyFiles = [
    ...readdirSync(new URL("docs/copy/", repo)).map((name) => new URL(`docs/copy/${name}`, repo)),
    ...readdirSync(new URL("content/", root))
      .filter((name) => name.endsWith(".json"))
      .map((name) => new URL(`content/${name}`, root)),
  ];
  return copyFiles.map((file) => readFileSync(file, "utf8")).join("");
}

/** Every non-Telugu character in the copy, plus printable ASCII and the typography we always need. */
function latinCharacters(fromCopy: string): string {
  const always = `${range(0x20, 0x7e)}₹·‘’“”–—…×•›‹→←↑↓✓`;
  return [...new Set([...codePoints(always), ...codePoints(fromCopy)])]
    .filter((char) => !isTelugu(char) && (char.codePointAt(0) ?? 0) >= 0x20)
    .sort()
    .join("");
}

/** The whole Telugu block, joiners, dandas and the dotted circle, so every conjunct can be shaped. */
const TELUGU = `${range(0x0c00, 0x0c7f)}\u200C\u200D\u0964\u0965\u25CC`;

/** Characters the copy uses that no font should be expected to carry (emoji, box drawing, arrows used only in docs). */
const IGNORED = /\p{Extended_Pictographic}|[\u2500-\u257F\u2191\u2193]|\uFE0F/u;

const checkOnly = process.argv.includes("--check");
const copy = copyText();
const latin = latinCharacters(copy);
/** Telugu characters the copy actually uses: what must render today. */
const teluguInCopy = [...new Set(codePoints(copy).filter(isTelugu))].join("");
mkdirSync(output, { recursive: true });

let problems = 0;
for (const job of FONTS) {
  const buffer = readFileSync(new URL(job.source, sources));
  const font = fontkit.create(buffer) as fontkit.Font;
  const text = job.script === "telugu" ? `${latin}${TELUGU}` : latin;
  const needed = job.script === "telugu" ? teluguInCopy : latin;
  const missing = codePoints(needed).filter(
    (char) => !IGNORED.test(char) && !font.hasGlyphForCodePoint(char.codePointAt(0) ?? 0),
  );
  const status = missing.length === 0 ? "ok" : `MISSING ${missing.length}: ${missing.join(" ")}`;
  if (missing.length > 0) problems++;

  if (checkOnly) {
    console.warn(`${job.file.padEnd(42)} ${String(font.numGlyphs).padStart(5)} glyphs  ${status}`);
    continue;
  }
  const subset = await subsetFont(buffer, text, {
    targetFormat: "woff2",
    ...(job.variationAxes ? { variationAxes: job.variationAxes } : {}),
  });
  writeFileSync(new URL(job.file, output), subset);
  const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
  console.warn(
    `${job.file.padEnd(42)} ${kb(buffer.length).padStart(9)} -> ${kb(subset.length).padStart(8)}  ${status}`,
  );
}

if (problems > 0) {
  console.warn(
    `\n${problems} font(s) lack characters the copy uses. The browser draws those characters in the metric-matched fallback font.`,
  );
}

// Storybook cannot use next/font, so it gets plain @font-face rules for the same files (served from /fonts).
if (!checkOnly) {
  const faces = FONTS.map(
    (job) => `@font-face {
  font-family: "${job.family}";
  src: url("/fonts/${job.file}") format("woff2");
  font-weight: ${job.weight};
  font-style: ${job.style};
  font-display: swap;
}`,
  ).join("\n\n");
  const storybookCss = new URL("../../packages/ui/.storybook/fonts.css", root);
  writeFileSync(
    storybookCss,
    `/* Generated by apps/web/scripts/fonts.ts. Do not edit; run pnpm --filter @ngb/web fonts. */\n${faces}\n`,
  );
  console.warn("Wrote packages/ui/.storybook/fonts.css");
}
