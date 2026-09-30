import { tokens } from "@ngb/tokens";
import type { Metadata, Viewport } from "next";

import { env } from "@/env";
import { getContent, isLang, langs } from "@/content";
import { SkipLink } from "@/sections/SkipLink";

import { fontVariables } from "../fonts";

import "../globals.css";

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

// Only /en (served as "/") and /te exist; any other first segment is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

/** Root layout for both languages: `lang` on <html> comes from the URL (/te for Telugu). */
export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: value } = await params;
  const lang = isLang(value) ? value : "en";
  const t = getContent(lang);
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <SkipLink label={t.a11y.skipToContent} />
        {children}
      </body>
    </html>
  );
}
