import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getPageContent } from "@/content/lang";
import { Checkout } from "@/sections/Checkout";
import { loadCheckout, SESSION } from "@/server/checkout";

// Dynamic, never cached, never indexed: set once for the whole group in (checkout)/layout.tsx.

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPageContent();
  return { title: t.checkout.title };
}

/** Checkout (pages.md: Checkout, screen B6). The price comes from the database on every request. */
export default async function CheckoutPage({ params }: PageProps<"/[lang]/checkout/[program]">) {
  const { program: slug } = await params;
  const jar = await cookies();
  const view = await loadCheckout(slug, jar.get(SESSION.cookie)?.value);
  if (view.state === "not_found") notFound();

  return (
    <main id="main">
      <Checkout
        program={view.state === "ready" ? view.program : null}
        signedInPhone={view.state === "ready" ? view.signedInPhone : null}
      />
    </main>
  );
}
