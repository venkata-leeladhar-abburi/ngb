import type { Metadata } from "next";
import Link from "next/link";

import en from "@/content/en.json";
import { Placeholder } from "@/sections/Placeholder";
import { SkipLink } from "@/sections/SkipLink";

import { fontVariables } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "404 | NGB Evolve",
  robots: { index: false },
};

/**
 * Any URL no page matches. It renders without the [lang] layout, so it is in English; the Telugu 404
 * comes with the NotFound section (screen C3, Phase 6).
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables("en")}>
      <body>
        <SkipLink label={en.a11y.skipToContent} />
        <Placeholder headline={en.notFound.headline} sub={en.notFound.sub}>
          <Link href="/">{en.notFound.home}</Link>
        </Placeholder>
      </body>
    </html>
  );
}
