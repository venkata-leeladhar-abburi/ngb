import type { Metadata } from "next";

import en from "@/content/en.json";
import { NotFound, notFoundCopy } from "@/sections/NotFound";
import { SkipLink } from "@/sections/SkipLink";

import { fontVariables } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "404 | NGB Evolve",
  robots: { index: false },
};

/**
 * Last-resort 404, rendered without the [lang] layout, so it is in English with no header or footer.
 * Unknown URLs normally reach `[lang]/not-found.tsx` through the `[lang]/[...rest]` catch-all.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables("en")}>
      <body>
        <SkipLink label={en.a11y.skipToContent} />
        <main id="main">
          <NotFound {...notFoundCopy("en", en)} />
        </main>
      </body>
    </html>
  );
}
