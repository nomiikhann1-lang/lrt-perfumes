# Acceptance checks

## Mobile-first theme and bridge 2.6.0

All 50 automated JavaScript tests pass. The production build passes. Browser checks covered 16 routes on 390px and 1440px screens, plus the shop, story, contact and a store page at 320/430/768/1024px, with no horizontal overflow. Production browser checks verified mobile footer expand/collapse, social destinations, cookie settings, mobile navigation, exact three-item desktop perfume navigation, search using arrow keys and Enter, adding a fragrance to the bag, matching primary button colours, store hours, branch-specific WhatsApp numbers and store FAQs. The browser reported no JavaScript errors during the production interaction run. Shared animations honour reduced motion.

The actual plugin modules pass PHP 8.1 syntax parsing and the CSV/editor/signature harness runs successfully on PHP 8.3 WebAssembly. Coverage includes removal of the colour field and CSV column, ignoring legacy custom colours, deriving colour after family edits, alias migration, market prices, variation prices and signed-request rejection. The ZIP uses the existing `lrt-bridge/` plugin root, standard forward-slash paths, and file hashes match the source. A live WordPress installation and actual WooCommerce database update were not available for this verification.

## Product scent imagery and expanded demo catalogue

The restrained product scenery uses one faint family icon and two photographic ingredient accents, confined to the outer quarters of each image panel. Browser checks verified this spacing for all ten families, light product-panel colours, desktop hover/focus, continuous touch and product-page visibility, favorites/bag controls, reduced motion, and no overflow at the phone widths below. The home slider is outside these styling rules.

The 30-product demo catalogue has at least two examples in each of the ten scent families. All 47 automated tests pass, including coverage of unique sample IDs/slugs, market prices, sizes, and family coverage. Browser checks verified desktop hover and keyboard-focus reveals for all families, default visibility on touch screens, permanent product-page backgrounds, favorites and bag controls, the new sample products' size selection, reduced motion, and no horizontal page overflow at 320/360/390/430 px. No browser JavaScript errors were observed. These sample additions do not modify the connected WooCommerce catalogue.

## Home scent slider verification

All 47 automated tests pass. The production build and browser checks cover all ten family slides and shop links; the existing family PNGs; desktop, tablet and phone layouts at 1440×900, 820×1180, 844×390, 390×844, 360×640 and 320×640; active-tab visibility; native touch scrolling of the tab row; swipe and keyboard navigation; wraparound; transition click locking; autoplay pause/resume; reduced motion; the shopping bag; and navigation to an empty family without a 404. No browser JavaScript errors were observed. Live WooCommerce and payment testing still require the connected installation.

Run npm test and npm run build.
Check at 320, 390 and 430px: horizontal product rows, no horizontal page overflow, separate multi-select filters and flag/currency dropdown, drawer close/Escape, search keyboard navigation, favourites, carousel scrolling and product links.
Choose Qatar: 50ml Saffron Veil QAR129, 100ml QAR209, 200ml QAR339. UAE: AED145 / AED235 / AED375. Check cart and checkout currency and country changes. Missing prices must block purchase. Test reduced motion and video poster fallback.
On WordPress verify each market/size, simple and variation stock, tax configuration, COD, card payment and callbacks, order currency, account links and retry idempotency. Live backend is unverified.

Verify /api/market using deployment country headers: AE → AE, any other or unknown → QA; manual selection persists. Check cookie choices across reload and reopening settings. Verify production canonical origin and robots/sitemap after enabling SITE_INDEXING with the live catalog.

V5 verified: four desktop cards per row, automatic bag drawer, separate checkout, simulated card order confirmation, mobile suggestion-only search without bottle images. Check About dropdown links, flag keyboard navigation, carousel arrows/swipe without a visible scrollbar, and favicon after clearing browser cache. All 14 automated tests passed.

V6 verified: production build and all 16 tests pass. Browser checks covered warm collection (2 matching products), directory groups, brand route, product taxonomy after note breakdown, add confirmation followed by View cart centered popup, full-width campaign bands and mobile 390/320px no page overflow. Campaign MP4 is 10 seconds with poster and play/pause. V6 supersedes V5 automatic drawer behavior.

## v7 verification

Run `npm test` and `npm run build`. Results from this update are in `reports/`.

For the optional browser harness, install Playwright in a separate QA tools directory (not an application dependency), supply its module path using `QA_PLAYWRIGHT`, and supply a Chrome binary with `CHROME_PATH`. Start the production server with `CHECKOUT_ORIGIN=http://127.0.0.1:3002` and port 3002, then run `node scripts/browser-qa.mjs`. `QA_BASE_URL` can change the test origin; update server CHECKOUT_ORIGIN to match. The harness uses only the standalone demo and synthetic details; do not run against live commerce.

The test environment's initial unconfigured-origin browser attempt failed with 403. Correctly configuring the exact test origin resolves this without weakening the cross-origin check. See final browser results for the completed run.

PHP syntax was parsed with php-parser. No PHP runtime, WordPress database or payment sandbox was available. Those checks are blocked, not passing.
## November 2026 storefront polish

Verified on the final local Vercel project build:

- 53 Node tests pass, including strict number matching, parent/variation SKU normalization and search thresholds. The threshold tests were rerun after tightening the alphabetic character count.
- `npm run build` passes.
- Production Chrome: 24 checks pass with no JavaScript errors. Shop, story, Doha store and Amber collection have no horizontal overflow at 320, 390, 768 and 1440px. Header search, keyboard selection, adaptive local suggestions, video positions/playback, hover, mobile drawer, WhatsApp links, map switching, social assets, scroll-to-top and reduced motion are covered.
- Additional homepage/footer checks pass at 320, 390 and 1440px with no JavaScript errors.
- Bridge PHP syntax and the PHP 8.3 WASM CSV/auth/family-colour harness pass. ZIP entries use portable forward-slash paths under `lrt-bridge/`.
- Screenshots and browser results: `reports/ui-polish/`. Browser harness: `scripts/ui-polish-qa.mjs`, using the existing `QA_PLAYWRIGHT`, `CHROME_PATH` and optional `QA_BASE_URL` environment variables.

Live WordPress installation, payment processing and Vercel publication were not performed.

## November 24 restoration verification

54 Node tests pass, including free shipping in both markets. Production build passes. The restoration browser harness covers shop, product, contact, collections, brands and fragrance guide at 320, 390 and 1440 pixels, plus dropdown imagery/links, header-only search imagery, homepage removals, footer copy and accessibility 404. Results: 19 checks, no JavaScript errors, in reports/restoration/results.json. Run scripts/restoration-qa.mjs using the same external Playwright/Chrome environment variables described above.

Bridge 2.8.0 passes PHP syntax and the PHP 8.3 WASM CSV/auth/family-colour harness. The ZIP uses portable paths under lrt-bridge/. Live WordPress checkout and deployment remain unverified.
