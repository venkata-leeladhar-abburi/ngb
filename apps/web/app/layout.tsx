import type { Metadata } from "next";
import type { ReactNode } from "react";

import { env } from "@/env";
import { SkipLink } from "@/sections/SkipLink";

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

// Phase 6 adds the /te root with lang="te" and hreflang alternates.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
