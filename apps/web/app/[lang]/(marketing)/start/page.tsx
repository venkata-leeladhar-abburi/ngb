import type { Metadata } from "next";

import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { StartChoices } from "@/sections/StartChoices";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, "/start", { title: t.start.find, description: t.start.headline });
}

/** Instagram landing (pages.md: Instagram landing): the bio-link page, three choices, no scroll. */
export default function StartPage() {
  return (
    <main id="main">
      <StartChoices />
    </main>
  );
}
