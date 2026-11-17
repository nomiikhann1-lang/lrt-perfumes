## v12 storefront update

Deploy the frontend to Vercel. The store pages, map embeds, navbar search and campaign films use the existing v11 WooCommerce bridge. See [EDITING.md](EDITING.md) for campaign and branch settings.

## v11 storefront update

See [EDITING.md](EDITING.md) to edit shop tiles, story content and scent families. Deploy the frontend and update the existing WooCommerce bridge with the included lrt-bridge.zip (2.5.0).

## v10 — Vercel and security update

Start with `VERCEL-SETUP.txt` and `SECURITY-AUDIT.txt`. Use the included bridge 2.4.0 on your existing WordPress backend. Account functionality has been removed from the storefront. Vercel testing defaults enable connected orders and disable demo fallback and indexing. Enter your existing backend URL and secret in Vercel project settings. Earlier version notes below are historical; v10 instructions take precedence.

## v9 interface refinements

See `reports/V9-RELEASE-NOTES.md` for the restored image-led perfume menu, searchable brand filter, product quantity stepper, note and spacing fixes, cookie prompt and footer redesign. The included bridge remains version 2.3.0.

## v8 update

This package includes the separate Brand directory, Favorites, dropdown sorting, 40-card scroll batches, existing-data brand filtering, same-brand recommendations, and product/checkout spacing refinements. Install the included `lrt-bridge.zip` to update the existing bridge to 2.3.0. Read `CSV-IMPORT-EXPORT.md` before importing products; `reports/V8-RELEASE-NOTES.md` records validation and remaining live-site checks.

# v7 staging update — read first

This archive contains incremental fixes to v6. It is **not yet production-ready**. Start with `reports/RELEASE-REVIEW.md`, `reports/BENCHMARK.md`, and test evidence under `reports/`.

Update the included WordPress bridge and frontend together on staging. Real order submission is now gated by `COMMERCE_ENABLED=true`; leave it false until the documented commerce blockers are resolved. Standalone demo checkout still works. Set `CHECKOUT_ORIGIN` to the exact browser origin, including the port on localhost, to match origin validation behind proxies.

Existing deployment notes below are historical context; the v7 release review takes precedence wherever they conflict. No live deployment has been performed.

---

# LRT Perfumes — Whole-site update v6

Run `npm ci`, `npm run dev`. Production: `npm run build`, `npm start`.

Shared desktop/mobile discovery filters, multi-select scent families and genders, shop search, flag/currency dropdown, photo/video hero, latest drops and expanded home sections. Mobile shop uses horizontal product rows. Existing search, favourites, cart, checkout, accounts and pages are retained. Read UPDATE-NOTES.md for cookie controls, location detection and Google indexing setup.

## v6 collections and media

`/collection` is the directory. Gender, scent family, arrivals, bestsellers, brand and collection pages use `/collection/<slug>`; product pages retain `/product/<slug>`. Existing supported single-filter shop URLs and plural `/collections` URLs redirect. Search and combined filters remain query-based and noindex.

Bridge 2.1.0 adds optional Brand and Collection fields in WooCommerce scent details. Defaults are LRT Perfumes and Signature collection; set Product badge to New or Bestseller for those edits. Updating these fields creates the corresponding filtered collection page. Renaming a brand or collection changes its URL: add a permanent redirect when renaming an indexed collection.

`public/campaign-wide.png` is generated conceptual imagery, not a real product photo. `public/campaign-film.mp4` is a 10-second animated pan/zoom of that image. Replace them with final brand campaign assets; the original hero photo/video setting is retained. The new film includes pause/play, reduced-motion handling and poster fallback.

## WordPress update
Deactivate the previous bridge before installing `lrt-bridge.zip`. Keep existing products and orders. Set `LRT_API_SECRET` (32+ random characters) in wp-config.php and the same value in Next.js `.env.local`, alongside `WORDPRESS_URL`. The new API uses `/wp-json/lrt/v1/`. Existing scent metadata is read without deleting it. Previously saved browser favourites and bags are migrated; retired sizes are marked unavailable.

Simple products: edit six independent amounts under LRT Perfumes market prices: AED and QAR for 50, 100 and 200 ml. Blank means unavailable. Stock is shared for simple products. Variable products: use Size/pa_size values 50 ml, 100 ml, 200 ml, enter a normal WooCommerce regular price so each variation is purchasable, and enter its separate LRT AED/QAR fields. Variation inventory is supported. Set the parent product image once for all sizes. Save product scent details to expose it through the bridge.

The frontend consumes variants: [{size:50,variationId:null,stock:24,prices:{AED:145,QAR:129}}]. There are no currency conversions or size multipliers. Checkout derives currency from country and reads prices on the server. Gateways must support both order currencies. Live WordPress, taxes, stock reservations and gateway transactions need testing on your installation.

Qatar preview shipping is free. UAE preview shipping is AED 20, free from AED 250. Confirm business delivery rules before launch. Sample products and prices remain illustrative.

## Hero
Edit `lib/store-config.js` mobileHero. Default photo: `/hero-mobile.png`. For video, set type to `video`, src to an uploaded public MP4 path and poster to your photo. Video is muted, looping and inline, with pause control and reduced-motion support. The supplied campaign photo is AI-generated concept imagery, not a photograph of your actual bottle.

## Content and verification
Business summaries in `lib/mobile-pages.js` are based on lrtperfumes.com About, Contact, FAQs, Privacy, Terms and Returns pages. Source links are included. Published policies differ on returns/exchanges and Qatar shipping coverage; those differences are noted. These summaries are now used on all devices, with remaining pages in lib/pages.js.

14 automated tests cover search, independent market/size pricing, rejected currency mismatch, invalid sizes, aggregate stock and checkout validation. Production build checked. Browser checks covered desktop filters/search/currency and product navigation scroll reset, plus mobile previews at 390 and 320 px. Live WordPress/payment testing has not been performed.

## Checkout and v5 navigation
Read UPDATE-NOTES.md for the complete v5 changes. Checkout is a dedicated /checkout page; adding a product opens the bag drawer. The bridge does not need reinstallation if 2.0.0 is already active. Live card payments still redirect to the configured WooCommerce payment provider. Use NEXT_PUBLIC_SITE_URL for your exact public origin; CHECKOUT_ORIGIN optionally allows a separate trusted reverse-proxy preview origin.
