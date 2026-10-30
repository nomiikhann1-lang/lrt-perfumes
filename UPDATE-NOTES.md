## v10.1 — Checkout origin correction

Accept exact Vercel deployment, branch and production origins from platform configuration. Cross-site requests and unconfigured origins remain blocked. For additional custom domains, set CHECKOUT_ORIGIN to the exact frontend HTTPS origin and redeploy. No bridge update needed for this fix.

Validation: 43 unit tests pass; production build passes. No live order placed.

# Whole-site update v6

- Full-width homepage and media bands with original background colours retained. New occasion edits, fragrance ritual content and Lucide icons.
- Original conceptual campaign photo plus animated image film with pause/play, reduced-motion support and fallback poster.
- Collection directory and filtered clean URLs for gender, scent, new arrivals, bestsellers, brands and named collections. Dedicated metadata, canonical URLs and sitemap entries; duplicate legacy filters redirect.
- Product description and top/heart/base notes precede linked brand, collection, gender and scent-family details.
- Add to bag shows the named product confirmation and View cart action; View cart opens the centered bag with refined typography.
- Bridge 2.1.0 adds optional Brand and Collection fields without removing existing price, inventory or checkout features.
- Production build and 16 automated tests passed. Browser checked collection filters/directory, product ordering, brand navigation, toast-to-centered-cart, media loading, desktop full-width sections and mobile layouts at 390/320px with no page overflow. Live WordPress and payment integration remain unverified.

## Previous update history (superseded where v6 differs)

# LRT Perfumes v5 — navigation, discovery & checkout

All future changes apply site-wide unless explicitly labelled mobile-only. Previous shopping, saved items, search, quiz, account, checkout and WooCommerce bridge functionality is retained.

## New in v5
- Stronger navbar; Contact follows Our Story. About dropdown includes all information pages; expanded footer includes contact numbers and store locations.
- Four desktop product cards per row, rounded containers and original product backgrounds.
- Add to bag opens the shopping bag drawer. Checkout now has its own /checkout page with delivery details, styled cash/card choices and a responsive order summary.
- Circular flag-only market dropdown with accessible country/currency labels. Existing location defaults and independent prices remain.
- Outlined shop search with popular-search chips; mobile overlay starts with suggestions and hides bottle images from search results.
- Latest drops scrollbar hidden; arrows and touch swiping remain. Refined product details and reduced-motion-aware transitions.
- Uploaded logo used as browser and Apple icon.
- Fixed checkout reference creation on local HTTP previews; exact configured public-origin support for reverse-proxy checkout requests. Set NEXT_PUBLIC_SITE_URL to your public origin, or CHECKOUT_ORIGIN for a separate preview origin. Unrelated origins remain rejected.
- Existing bridge 2.0.0 already supports cash on delivery and hosted card payments; no plugin update required. It remains included.

## Retained from v4
- Desktop and mobile now share business content, scent badges, a flag/currency dropdown, photo/video hero, latest drops carousel and separate Filter / Gender / Scent family / Sort panels.
- Multiple selections are OR within a group, AND between groups. Search combines with filters. Saved fragrances remain available.
- Shop-page search and mobile horizontal product rows with visible add-to-cart buttons.
- Additional home sections for scent families, bottle sizes and store discovery.
- Dialog focus uses preventScroll; route changes start at the top.
- Essential market and consent cookies, six-month consent choice, and persistent Cookie settings control. Bag and saved items retain existing local storage. No analytics/marketing trackers are installed. Future optional scripts must check lrt_cookie_consent=all and respond to the lrt:consent event, including withdrawal.

## Location defaults
/api/market reads the hosting provider's x-vercel-ip-country or cf-ipcountry header. AE selects AED; every other country or unknown location selects QAR. A saved choice overrides detection. Hosts/proxies must overwrite these headers with trustworthy geolocation; Hostinger deployments without these headers fall back to QAR. No browser location permission is needed. Prices remain separate WooCommerce fields, never exchange-rate conversions.

## Google launch setup
1. Set NEXT_PUBLIC_SITE_URL to the exact public domain, connect WooCommerce, replace sample products and confirm business/shipping copy.
2. Set SITE_INDEXING=true and rebuild/redeploy. Until then, the demo is noindex and robots blocks crawling.
3. Verify the domain in Google Search Console and submit /sitemap.xml.
4. Page-specific titles, descriptions, canonical URLs, Open Graph/Twitter images, Organization markup and live-catalog Product markup are included. Transactional/account and query-filter pages are noindex. Product markup does not invent ratings, reviews or offers.
5. Google controls actual titles, snippets and rich-result eligibility. This update does not submit the website to Google or guarantee rankings.

## Hero and backend
lib/store-config.js mobileHero is retained for compatibility and now controls BOTH desktop and mobile. Use type:'video', src:'/your-video.mp4', poster:'/hero-mobile.png' for video. Current hero is a conceptual campaign image. WordPress bridge and 50/100/200 ml independent AED/QAR price support are unchanged; follow README.md for plugin installation.

## Validation
Production build and 14 automated tests passed. Simulated card checkout completed end to end in the browser. Desktop four-column cards, automatic bag opening and dedicated checkout were verified; mobile search was visually checked at 390px alongside 320px layout checks. Browser checked desktop homepage, shop navigation, combined scent filters and search, cookie controls, plus mobile 390/320 px iframe previews. Live WordPress/payment and actual geographic hosting headers require deployment verification.
