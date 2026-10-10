/**
 * Structured data for search engines (schema.org JSON-LD). `<` is escaped so copy can never close
 * the script tag. Only put facts the docs hold in `data`; never invented ratings or counts.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
