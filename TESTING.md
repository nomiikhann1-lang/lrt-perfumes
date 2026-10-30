# Acceptance checks
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
