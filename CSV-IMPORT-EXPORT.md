# LRT Perfumes CSV workflow — bridge 2.6.0

Update the **existing LRT Perfumes Headless Commerce Bridge** using `lrt-bridge.zip`. There is no second bridge or brand plugin. Back up the database and try a small export/import on staging before a catalogue-wide import.

1. In WooCommerce → Products → Export, export all columns. Standard WooCommerce fields (ID, SKU, name, descriptions, categories, images, stock, type, parent and variation attributes) keep their normal meanings.
2. The export now also includes every LRT scent-detail field: brand, collection, scent family, audience, badge, occasion, season, concentration, ingredients, care, separate top/heart/base notes and sizes.
3. It includes six editable market-price columns: 50/100/200 ml × QAR/AED. `LRT Perfumes All market prices (JSON)` preserves prices for additional sizes, such as 55 ml. Keep it as exported unless changing those additional sizes. Explicit size-price columns override corresponding JSON entries.
4. **For simple products, native `Regular price` is the 50 ml QAR price.** If both Regular price and LRT 50ml QAR are imported, Regular price wins. The exporter writes the current 50 ml QAR value into Regular price, even for older records whose native price differs. If importing only the custom 50ml QAR column, it updates the native regular price too.
5. Keep headers unchanged. Products → Import automatically maps the LRT columns. Choose “Update existing products” to update matching IDs/SKUs. For new products, leave ID blank and assign a new unique SKU. Never reuse an existing product's SKU for a new fragrance.
6. Check a few imported products in the admin and storefront: note groups, each size, both markets, stock, image gallery and brand link. Export them again and compare the fields before proceeding with a full catalogue.

## Values and variation products

- Use unformatted non-negative prices with a decimal point, e.g. `129.50`; no currency symbols or thousands separators. `0` is a valid free price. A blank market price makes that market/size unavailable. Invalid prices stop that row rather than silently becoming zero.
- A mapped blank text column clears that field. Omitting a column preserves the existing field. Separate note columns preserve comma-separated notes within each note group. Multiline ingredients/care are retained.
- Sizes are comma-separated whole millilitres, from 1 to 2000. For simple products, the market-prices JSON stores additional-size prices. For variable products, WooCommerce size attributes and child variations define available sizes.
- Variable products use normal parent and variation rows. Native Regular price on a **variation row** is that variation's own QAR price (100 ml remains 100 ml). Use `LRT Perfumes Variation price AED` and `LRT Perfumes Variation price QAR` on each child row. Native Regular price wins a conflicting variation QAR value. Do not put every variation's price into a parent's 50 ml field.
- WooCommerce native sale-price columns remain unchanged. The headless storefront currently uses LRT market prices, not WooCommerce sale-price scheduling. If scheduling sales, a separate commerce change is required.
- Brand filtering reads the bridge's existing `brand` value. Native category assignments use WooCommerce's standard Categories column; populated categories can appear as collection pages automatically.
- Native product-brand taxonomy managed by another extension is not substituted for the existing LRT Brand field.

## Validation

`tests/csv-roundtrip.php` executes the real CSV module with small WordPress/WooCommerce stubs. It verifies header mapping, CSV quoting, all LRT fields, six standard prices, extra-size prices, zero and blank prices, omitted fields, regular-price precedence, variation prices and invalid input. It can run with PHP 8.1+ (`php tests/csv-roundtrip.php`). The release was tested using PHP 8.3 WebAssembly. This is not a live WordPress database import test; extension conflicts, site-specific taxonomy behavior and your actual catalogue still need staging verification.

Implementation uses WooCommerce's native exporter and importer hooks:
https://woocommerce.com/document/product-csv-importer-exporter/
https://woocommerce.github.io/code-reference/files/woocommerce-includes-import-class-wc-product-csv-importer.html

Older CSVs can still import the Legacy family column. Scent family takes precedence when both are populated. The editor and new exports use only Scent family.

Bottle colour is automatic in bridge 2.6.0. It follows Scent family in the API, editor and CSV import; new exports omit the Bottle colour column. Remove that legacy column from older templates. Changing a family updates the derived colour without affecting photos or prices.
