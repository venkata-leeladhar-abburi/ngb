import { tokens } from "@ngb/tokens";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { env } from "@/env";
import { SkipLink } from "@/sections/SkipLink";

import { fontVariables } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "NGB Evolve",
    template: "%s | NGB Evolve",
  },
  description:
    "12-week plans built on Telugu food, for hostel, home or gym. Coached by Nawin, in your language.",
};

export const viewport: Viewport = {
  themeColor: tokens.color.bg.page,
  colorScheme: "dark",
};

// Phase 6 adds the /te root with lang="te" and hreflang alternates.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
