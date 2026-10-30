# v9 — screenshot-led interface refinements

- Restored image-led Perfumes navigation: three catalogue-backed image tiles, gender links, fragrance edits and scent discovery. Removed unrelated company/help destinations from this dropdown. Kept the requested Perfumes / Shop / Brand / Collection / Our story / Contact navbar order and existing brand routes.
- Reused the storefront bottle component in the menu; real catalogue photography remains preferred when supplied. No invented collections or stock images were added.
- Added searchable brand checkboxes, a clear-search control and a no-results state. Searching does not clear selected brands.
- Replaced the product quantity dropdown with an accessible minus / quantity / plus stepper, bounded by stock and the existing ten-per-line limit.
- Removed duplicated note pills from the product page. Top, heart and base notes remain in one responsive row.
- Added 28px separation between Add to bag and product detail accordions. Aligned checkout agreement checkboxes, payment radios and filter checkboxes.
- Updated the footer with the actual logo, store/contact discovery links and a permanent Cookie preferences control.
- Cookie consent is shown to first-time visitors and once again after upgrading from the old banner version. A valid new choice remains remembered for 180 days; the footer can reopen it anytime. No tracking scripts were added.
- Corrected a product-page brand link argument discovered during this work.

Validation: 30 unit tests; 17 existing browser checks; 11 new browser checks for consent migration/persistence, menu destinations/Escape, brand search, quantity limits, notes, spacing, brand links, footer logo and checkbox alignment/no overflow at 320/390/768/1440px. Production build passed. Screenshots reviewed locally, not included in the package.

This update implements the screenshot-specific requests. It does not certify every remaining item in the larger sections 3–8 brief. Live WordPress import/export, payment and catalogue verification remain as documented in v8. Bridge version remains 2.3.0; no CSV behavior changed in v9.
