import { SectionTitle, StudioBackdrop, Text, Wordmark } from "@ngb/ui";
import NextLink from "next/link";

import { localePath } from "@/content";
import { getPageContent } from "@/content/lang";
import { fill, formatInr } from "@/lib/format";

import { CheckoutFlow } from "./CheckoutFlow";

interface CheckoutProps {
  /** From the database, never from the browser. Null when checkout cannot reach its services. */
  program: { name: string; weeks: number; pricePaise: number } | null;
  signedInPhone: string | null;
}

/**
 * Checkout (pages.md: Checkout, screen B6): what is being bought, then the steps. No site navigation,
 * only the wordmark home: one job on this page. If the database or login is unreachable it says so
 * plainly instead of showing a form that cannot work.
 */
export async function Checkout({ program, signedInPhone }: CheckoutProps) {
  const { lang, t } = await getPageContent();
  const copy = t.checkout;
  const price = program ? formatInr(program.pricePaise / 100) : "";

  return (
    <StudioBackdrop variant="night" className="min-h-dvh px-page py-24">
      <div className="mx-auto flex max-w-(--container-lead) flex-col gap-48">
        <NextLink href={localePath(lang, "/")} aria-label={t.site.homeLabel} className="self-start">
          <Wordmark size="sm" />
        </NextLink>
        <div className="flex flex-col gap-16">
          <SectionTitle as="h1">{copy.title}</SectionTitle>
          {program && (
            <Text variant="lead">
              {fill(copy.summary, { program: program.name, weeks: program.weeks, price })}
            </Text>
          )}
        </div>
        {program ? (
          <CheckoutFlow copy={copy} lang={lang} price={price} signedInPhone={signedInPhone} />
        ) : (
          <Text role="alert">{copy.unavailable}</Text>
        )}
      </div>
    </StudioBackdrop>
  );
}
