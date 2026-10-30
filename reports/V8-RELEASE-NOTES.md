# v8 — brand discovery, catalogue controls and CSV parity

## Implemented

- Favorites wording, retaining existing `lrt-saved` device storage and accepting old Saved query links.
- Separate `/brand` searchable editorial grid and `/brand/[slug]` pages. Existing brand collection links permanently redirect. Brands removed from the collection directory. Navigation order: Perfumes, Shop, Brand, Collection, Our story, Contact. Footer brand access added.
- Native sort dropdown and an existing-data brand filter immediately after Scent family. Filters combine with search and sort.
- First 40 rendered cards, then 40 more at each scroll boundary, with accessible manual fallback. Filter/sort changes reset the visible window. Catalogue data still loads through the existing cached catalogue service so client-side filtering and brand counts cover the entire catalogue; this is progressive rendering, not a new paginated product API.
- Same-brand-only recommendations, excluding the current product; recommendation section is hidden when there are no same-brand alternatives.
- Product gallery from real WooCommerce images, quantity selector, existing size-specific price/stock handling, purchase validation, breadcrumbs and real note groups.
- Data-driven collection hero, related collections, canonical brand metadata, collection ItemList schema and sitemap routes. Populated native WooCommerce categories can produce collection pages; no invented categories or brand logos.
- Mobile/tablet navigation, Escape/focus handling, visible keyboard focus, reduced-motion support and 44px controls. Product-card entrance animations removed; restrained hover transitions retained.
- Shared spacing refinements across the brand directory, collection hero, product detail and checkout. Fixed checkbox sizing without reducing field touch targets.
- Existing bridge updated to 2.3.0 with native WooCommerce CSV support and round-trip market pricing. See `CSV-IMPORT-EXPORT.md`.

## Validation

- 30 Node unit tests passed.
- Existing 17 browser checks passed, including simulated checkout; no real order or payment.
- 12 added browser checks passed using a temporary 121-product fixture, including 40→80→120→121 rendering, sort reset, brand filter, navigation order and Escape focus, brand routes, and no horizontal overflow on brand/shop/product/checkout at 390/768/1440px.
- Real PHP CSV code executed in a PHP 8.3 hook harness. All mapping and round-trip assertions passed.
- Production build passed. Temporary QA fixture excluded from source deliverable.

## Limits that still require the connected site

No live WooCommerce credentials or database were available. Install the updated bridge, test a small staging CSV import/export and verify the live catalogue. Existing commerce remains gated: configured shipping/tax/payment behavior and live checkout have not been certified by this update. Real reviews are not fabricated. This remains the existing JavaScript/Next.js project, not a TypeScript migration.

Earlier reports document v7 and remain for provenance. `V8-*` evidence applies to this update.
