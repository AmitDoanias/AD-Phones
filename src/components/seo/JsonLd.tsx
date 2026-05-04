/**
 * Injects a JSON-LD <script> block into the page <head>.
 * Usage: <JsonLd data={localBusinessSchema()} />
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
