# LRT Perfumes — v7 staging candidate

Updated 27 October 2026. This is an incremental update of the supplied v6 archive, not a replacement application. **Not approved for production launch.** No production files, DNS, orders, payments or customer notifications were changed.

## Scope and baseline

Inspected App Router pages, client storefront, styles, image/video assets, package lock, all API routes, configuration, existing tests and the bundled PHP commerce bridge. The project is JavaScript/JSX, not TypeScript. The lockfile installs Next.js 16.4.2 with React 19; no framework switch or application dependency was introduced. There is no existing lint or independent type-check configuration.

The initial 16 Node tests passed and the production build passed. Initial build output is retained in `baseline-build.txt`. The public business homepage was readable through web retrieval; the configured preview at https://app.scentalogue.com could not be retrieved by that tool. Local production-mode browser testing is distinct from inspecting the deployed preview.

## Prioritised findings

| Priority | Finding | Result |
|---|---|---|
| Launch blocker | Bridge creates orders directly and supplies hardcoded shipping rather than using configured shipping-zone selection; no coupons or persistent WooCommerce cart session | Not represented as complete commerce. Added explicit `COMMERCE_ENABLED` launch gate. Sandbox integration work remains. |
| Launch blocker | No backend credentials, payment sandbox, Hostinger logs, database access or deployment access supplied | Live stock, tax, sessions, payment callbacks, notifications and hosting resource usage are blocked from verification. |
| High | Every public catalogue request bypassed cache; route prefetch could trigger many dynamic page renders | Added single-flight 60-second per-process catalogue cache, 5-second outage cooldown and disabled speculative Next Link prefetch. |
| High | Catalogue endpoint silently limited results to 100 | Added stable-ID pagination, sequential retrieval, schema checks and a hard 20-page limit. Exceeding 2,000 products fails explicitly rather than serving an incomplete catalogue. |
| High | Frontend assumed 50/100/200 ml; public business catalogue also shows 55 ml | Derived frontend options and first-size quick add from variants; bridge discovers numeric ml sizes from variation attributes. Multi-attribute and non-ml variants still need a dedicated model. |
| High | Checkout redirect accepted arbitrary destinations; errors exposed backend details | HTTPS same-origin WooCommerce redirect check, safe upstream error, no-store response headers. |
| High | Body limit checked after reading; no attempt limiter | Streaming byte limit and bounded per-process limiter. Distributed edge enforcement remains required. |
| High | Draft policies could contradict older mobile summaries | Central shared drafts now take precedence. Added explicit business-confirmation placeholders. Historical source summaries remain for reference but do not override active pages. |
| Medium | Large PNG/JPEG assets; image lazy loading contradicted requested behaviour | Added offline-compressed WebP assets and eager loading; originals retained for rollback. |
| Medium | Google Fonts failed in the test environment | Self-hosted the existing font families with license files; no external font calls needed. |
| Medium | Footer duplicated links and mixed informational/legal navigation | New reusable four-part footer, responsive columns, separate legal row, working page destinations. |
| Medium | Cookie control was a standalone button after the footer | Reopening now lives on Privacy. Existing choice values, cookie expiry, secure flag and consent event remain unchanged. |
| Medium | Repeated submits, browser storage failures and absent saved products | In-flight submit guard, storage-write exception handling, unavailable-line checkout guard, pending request reuse via sessionStorage hash on secure contexts. |
| Medium | Empty collections and slug collisions | Empty groups filtered and generated slugs de-duplicated. Existing navigation still needs a catalogue-specific review before launch. |

## Phase 1 — Audit

Inspected all 57 original archive entries, including nested bridge source, environment example and Docker configuration. Baseline: 16 tests and production build passed. No live Hostinger/WordPress process measurements were available. Source inspection found avoidable requests, but did not establish the cause of reported 100% CPU.

## Phase 2 — Stabilise

Changed `lib/catalog-service.js`, `lib/wordpress.js`, `lib/catalog.js`, `lib/collections.js`, `lib/seo.js`, `app/api/catalog/route.js`, `components/Storefront.js`, and `wordpress/lrt-bridge/lrt-bridge.php`.

Added cached catalogue access shared by routes and the catalogue API, bounded pagination, optional-field normalization, variable-size discovery and stock-aware first-size controls. An old bridge returning 100 entries is rejected to avoid silently accepting a potentially truncated catalogue. Update the bridge and frontend together on staging. The custom bridge still includes only products carrying LRT metadata; adding the entire existing business catalogue requires mapping that metadata and validating market prices.

Unit checks cover cache coalescing/expiry, outage cooldown, malformed data, size support and existing pricing rules. PHP has been syntax-parsed, but not executed against WooCommerce.

## Phase 3 — Design and interactions

Preserved existing colours, hero, editorial sections, product layout and centered cart. Added shared visible focus and skip navigation. The new footer follows the existing typography and palette. Added `components/StoreLink.js` to avoid speculative dynamic renders. Media remains eagerly loaded; viewport observation only controls video playback. Manual video pause is retained across viewport changes; reduced-motion and background-tab changes pause automatic playback.

Files: `components/EditorialMedia.js`, `components/StoreLink.js`, `components/Storefront.js`, `app/globals.css`, `app/layout.js`, `lib/store-config.js`, compressed assets and licensed font files. Browser tests cover actual menu, cart and checkout interactions, not just markup existence.

Still incomplete: multi-image product galleries, direct PDP quantity selector (quantity is editable in the cart), full large-catalogue server-side filtering, and device/assistive-technology coverage beyond local Chromium. No fabricated reviews or product facts were added.

## Phase 4 — Pages and footer

Files: `components/Footer.js`, `components/CookiePreferences.js`, `lib/pages.js`, `app/[page]/page.js`, `app/sitemap.js`, styles and storefront rendering.

New pages: `/stores`, `/payment-methods`, `/product-care`, `/accessibility`. Shipping, returns, privacy and terms now use clearly labelled centralized drafts. Existing about, contact, FAQ, guide and disclaimer routes remain. Removed duplicate footer links and added crawlable destinations. No fake social accounts, newsletter subscription, tracking tool or loyalty buttons were introduced.

Cookie save behaviour is preserved; Privacy provides an accessible reopening button. Both essential-only and accept-all paths are exercised in browser QA. Business names, addresses, opening hours, delivery coverage/rates, refund conditions, retention periods and jurisdiction require owner confirmation. Drafts are not legally approved.

Ten official reference sites were reviewed through publicly retrievable page content; `BENCHMARK.md` records exact scope and limitations. This was not exhaustive browser testing of every competitor page type or checkout.

## Phase 5 — Commerce

Files: checkout API, `lib/request-security.js`, storefront and bridge. Added a synchronous submit guard, persisted hashed request reference where Web Crypto is available, server-side terms validation, no-store responses, bounded payloads, safe payment redirects and accurate handling of unconfirmed card statuses. Product prices remain server-calculated by the existing bridge; submitted totals are not trusted.

Demo checkout works and is explicitly labelled. **The bag is still device-local and is validated against WooCommerce at order submission; it is not a WooCommerce Store API cart.** Coupons, configured shipping methods, authenticated-cart merge, real gateway transitions, webhook verification and concurrent stock/duplicate-order integration tests are incomplete. Existing bridge idempotency options require an operational retention/reconciliation policy; a crashed pending lock is not automatically discarded because that could permit a duplicate order.

`COMMERCE_ENABLED=false` is the default. The catalogue can be reviewed while real order submission remains unavailable. Do not enable until the staging commerce checks and actual business policies are complete. The local guard is 12 attempts/minute/process; without a trusted proxy it is shared across clients. Enable `TRUST_PROXY_IP` only if the proxy overwrites `X-Real-IP`, and use an edge limiter for multiple replicas.

## Phase 6 — Performance and security

Three requested images decreased from **5,205,197 bytes to 409,640 bytes (92.1% smaller combined)**. This is encoded asset size, not a Core Web Vitals or Hostinger CPU claim. Video was already a 10-second H.264 1280×720, 24fps asset at 1,180,266 bytes; retained without unnecessary re-encoding. Eager video loading can increase initial bandwidth by design.

Catalogue cache tests exercise 30 simultaneous reads resulting in one fetch. Catalogue freshness is up to 60 seconds per process; order submission reads current WooCommerce data. No personalized responses are stored in that cache. Cache cold starts and multiple Node replicas each perform their own fetch. The full catalogue is still delivered to the client; pagination is bounded, not an unlimited-scale search architecture.

No confirmed endless polling, revalidation loop or React effect loop was identified in inspected paths. Timers and listeners were reviewed; video listeners have explicit cleanup. This does not establish production CPU or memory health.

Added nosniff, frame denial, referrer and permissions headers. No privileged secrets are put in client props. HTTPS is required for production WordPress calls. A nonce-based CSP and provider-specific checkout CSP need deployment testing; HSTS is a hosting configuration responsibility. Dependency audit and scope are retained separately. Complete security is not claimed.

## Phase 7 — SEO and accessibility

Added Product offers for the default server-rendered QAR market using configured catalogue prices, breadcrumb JSON-LD, new sitemap destinations, skip link, focus outlines and a safe error page. Existing canonical URLs, clean collection routes and private-route noindex are preserved. Schema is emitted only for connected catalogue products; sample reviews and ratings are never invented. Market-specific SEO URLs are not implemented.

Staging stays noindex unless `SITE_INDEXING=true` with WordPress configured at build time. This flag alone does not verify the catalogue or approve launch. Validate production metadata after the final build and domain decision. Local tests check missing-product 404, robots, navigation and overflow. Full WCAG 2.2 AA, screen-reader testing, text scaling and contrast audit remain unverified.

## Phase 8 — QA evidence

Final validation: **25 unit tests passed, 17 browser checks passed, production build passed, and npm audit reported zero known vulnerabilities.** PHP AST parsing passed; no WordPress runtime test was performed.

See `unit-tests.txt`, `final-build.txt`, `browser-qa.json`, `dependency-audit.json` and `php-syntax.txt`. Browser tests use a local production Next.js server in demo mode and synthetic contact data. No live order or payment was sent. Browser tooling is optional and separate from application dependencies.

Not tested/blocked: real payments, gateway cancellation/retry, webhook signatures, order ownership, logged-in sessions, configured shipping/tax/coupons, stock concurrency, WordPress runtime, cross-browser assistive technology, real-user LCP/INP/CLS at the 75th percentile, Lighthouse TBT, sustained Node/WordPress memory and CPU under real traffic. The absence of these measurements is not a passing result.

## Phase 9 — Controlled release preparation

1. Back up deployed frontend, WordPress database, uploads, plugin files and environment configuration. Verify restore on an isolated staging environment.
2. Install the updated bridge on staging and upload the matching frontend. Do not run the sample importer against production.
3. Use `npm ci`, `npm test`, `npm run build`. For standalone output copy `public` and `.next/static` into the standalone directory before running `node .next/standalone/server.js`. Never run the development server in production.
4. Set server-only `WORDPRESS_URL` and a matching 32+ character `LRT_API_SECRET`; preserve the supplied public domain configuration until explicitly approved. Keep `SITE_INDEXING=false` and `COMMERCE_ENABLED=false` during review.
5. Confirm real catalogue metadata, sizes, independent AED/QAR prices, ingredients and photography. Replace test products; confirm rights to campaign images.
6. Complete WooCommerce cart/shipping/tax/coupon architecture and gateway sandbox tests. Confirm refunds, reservation expiry, failed/cancelled/pending status recovery, retry/idempotency and emails with notifications safely isolated.
7. Review all `[CONFIRM ...]` / `[ADD ...]` content with the business and appropriate legal adviser. The frontend policy text must match backend configuration.
8. Configure HTTPS, proxy IP trust, distributed rate limiting, private logging/retention, health monitoring, error alerting and cache behaviour. Compare Hostinger access logs and process CPU before/after representative traffic; inspect WP cron, bots, database slow queries and plugin tasks independently of Node/browser CPU.
9. Only after approval enable commerce, rebuild with approved indexing, and stage a controlled deployment. This archive has not been deployed.
10. Roll back frontend and bridge together to the preserved v6 release if checks fail. Do not roll back a live commerce database over newer orders; reconcile orders separately. Disable commerce first if checkout integrity is in doubt.

## Future extension points

Keep verified scent attributes as the basis of a richer quiz. Existing guest wishlist stays device-local; account synchronization needs authenticated WooCommerce ownership checks. Loyalty and bundles require defined backend rules. Locale dictionaries and RTL layout should be introduced together; no fake Arabic selector is present. Currency prices are independently configured, not converted by a guessed exchange rate. A Store API integration needs an explicit multi-currency strategy because the current bridge bypasses a standard WC cart session.

## What is required next

A staging WooCommerce connection and test gateway access; actual shipping/tax/currency/coupon configuration; catalogue metadata review; approved business/policy details; and Hostinger logs/metrics or an authorized hosting session. No passwords should be committed to the archive. These are concrete launch blockers, not completed features.
