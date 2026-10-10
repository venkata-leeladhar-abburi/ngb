import type { Metadata } from "next";

import { getPageContent } from "@/content/lang";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/sections/PageHeader";
import { Quiz } from "@/sections/Quiz";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";

// Static: the quiz runs in the browser, so the page itself is served from the CDN.
export const dynamic = "error";

const PATH = "/quiz";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getPageContent();
  return pageMetadata(lang, PATH, { title: t.quiz.title, description: t.home.goals.quiz });
}

/** Find my plan quiz (pages.md: Find my plan quiz): four questions, one program. */
export default async function QuizPage() {
  const { t } = await getPageContent();
  return (
    <>
      <SiteHeader path={PATH} />
      <main id="main">
        <PageHeader title={t.quiz.title} />
        <Quiz />
      </main>
      <SiteFooter path={PATH} />
    </>
  );
}
