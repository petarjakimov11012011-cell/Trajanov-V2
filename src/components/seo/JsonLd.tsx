// Renders a JSON-LD `<script>`. The data comes only from our own trusted builders (src/lib/seo), never
// from user input, but `<` is still escaped so a value can never break out of the script element.
export function JsonLd({data}: {data: object}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
    />
  );
}
