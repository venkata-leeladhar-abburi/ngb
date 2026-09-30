import Link from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { Placeholder } from "@/sections/Placeholder";

// Phase 6 replaces this with the NotFound section (screen C3) and adds the "Try free tools" button once /tools exists.
export default async function NotFound() {
  const { lang, t } = await getPageContent();
  return (
    <Placeholder headline={t.notFound.headline} sub={t.notFound.sub}>
      <Link href={localePath(lang, "/")}>{t.notFound.home}</Link>
    </Placeholder>
  );
}
