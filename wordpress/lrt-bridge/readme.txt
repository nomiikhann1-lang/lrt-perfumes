=== LRT Perfumes Headless Commerce Bridge ===
Requires PHP: 8.1
Requires Plugins: woocommerce
Stable tag: 2.8.0

Signed catalogue and checkout endpoints, scent details, market pricing and WooCommerce CSV support for LRT Perfumes.

== Installation / update ==
In WordPress, go to Plugins > Add New > Upload Plugin and choose lrt-bridge.zip.
If prompted, choose Replace current with uploaded. Keep WooCommerce active.
Existing product IDs, orders, photos, prices, stock and the LRT_API_SECRET setting are preserved.
Do not import the sample catalogue when updating a live store.

== Product setup ==
Choose Scent family under Products > Edit product > General > LRT Perfumes scent details.
Bottle colour is automatic. The ten family colours match the storefront's family palette.
Previously saved custom colours are ignored when reading products and replaced on the next save or CSV import.
CSV exports no longer include a bottle colour column. Remove that column from older import templates; it is no longer used.
Use Inspired Edition in Collection (or an Inspired Editions product category) for inspired fragrances.
Other fragrances appear under LRT Collection. Brand and individual collection pages remain available.
Uploaded product photos remain unchanged; automatic colour affects the rendered fallback bottle and family scenery.

== Changelog ==
= 2.8.0 =
* Free delivery in Qatar and the United Arab Emirates, with no minimum spend.

= 2.7.0 =
* Expose parent and variation SKUs to the storefront search index.
* Retain automatic scent-family colours and all existing product data.

= 2.6.0 =
* Removed the editable Bottle colour (hex) product field and CSV colour column.
* Derive catalogue, product-save, sample-import and CSV-import colour from canonical scent family.
* Preserve old scent-family aliases and existing AED / QAR size and variation prices.
* Clarify collection naming for the storefront's Inspired Edition / LRT Collection navigation.

= 2.5.0 =
* Shared scent-family selection, CSV support and signed commerce endpoints.
