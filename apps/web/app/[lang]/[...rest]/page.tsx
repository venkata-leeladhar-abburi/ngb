import { notFound } from "next/navigation";

// Unknown URLs are not known at build time; each is rendered once on demand and then cached.
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

/**
 * Every URL no other page matches. It only raises the 404, so the reader gets `[lang]/not-found.tsx`:
 * the right language on <html>, the header and the footer (handoff §7: a Telugu reader is never sent
 * to an English page). `global-not-found.tsx` remains as the last resort.
 */
export default function UnknownPage() {
  notFound();
}
