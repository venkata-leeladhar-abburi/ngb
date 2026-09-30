import { getPageContent } from "@/content/lang";
import { Placeholder } from "@/sections/Placeholder";

// Static: marketing pages are served from the CDN (playbook section 3). Never add dynamic APIs here.
export const dynamic = "error";

export default async function HomePage() {
  const { t } = await getPageContent();
  return <Placeholder headline={t.home.hero.headline} sub={t.home.hero.sub} />;
}
