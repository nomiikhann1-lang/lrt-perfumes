# Luxury storefront reference review

Reviewed public extracted content on 26 October 2026. These are quality references, not sources of copied assets, descriptions or branding. Homepage/navigation content was retrievable for all ten brands; YSL returned an offline/server-error notice alongside content. This review does not prove mobile layout, animation quality, checkout/payment behaviour or accessibility of those sites. Full Our Story, FAQ, legal and checkout review for every brand is not complete.

| Official reference | Observed content/navigation | LRT application |
|---|---|---|
| [CHANEL fragrance](https://www.chanel.com/us/fragrance/) | Product cards expose name, price, wishlist and bag controls; campaign/category links | Keep clear product discovery and purchase controls |
| [Dior Beauty](https://www.dior.com/en_us/beauty) | Icons/collections separated from service links such as contact and boutiques | Separate Explore, Customer care and The house |
| [Jo Malone](https://www.jomalone.com/) | Note-oriented search suggestions, empty bag/wishlist copy, editorial modules | Preserve notes search and meaningful empty states |
| [BYREDO](https://www.byredo.com/eu_en) | Category/format navigation, new arrivals, account and wishlist | Data-driven collection discovery, no fake future features |
| [Le Labo](https://www.lelabofragrances.com/) | Named collection, format and size navigation | Use actual available bottle sizes |
| [Tom Ford Beauty](https://www.tomfordbeauty.com/) | Fragrance collections and scent-family navigation are distinct | Maintain separate brand/collection/family links |
| [Diptyque](https://diptyqueparis.com/en-be) | Editorial studio narrative, seasonal collections and gifting paths | Keep editorial sections alongside shopping |
| [Maison Francis Kurkdjian](https://www.franciskurkdjian.com/eu-en) | Product cards show sizes and scent families; region/account/order support | Clear currency context and customer-care navigation |
| [Creed](https://www.creedfragrance.com/) | Gender, fragrance family, collections, house story, store locator and support | Separate store information and support destinations |
| [YSL Beauty](https://www.yslbeautyus.com/) | Retrieved location/currency controls and grouped fragrance/gifting navigation; offline notice present | Currency controls must reflect real checkout support; no assumption of working competitor checkout |

Additional pages opened: [CHANEL product](https://www.chanel.com/us/fragrance/p/107350/bleu-de-chanel-eau-de-parfum-spray/) (sizes, composition, ingredients and product details), [Le Labo Santal 33](https://www.lelabofragrances.com/santal-33.html), [BYREDO Bal d’Afrique collection](https://www.byredo.com/eu_en/c/perfume/best-sellers/bal-d-afrique), and [Creed contact](https://www.creedfragrance.com/c/contact-us/). These are limited public-content inspections, not transaction tests.

Technical references: [WooCommerce Cart Tokens](https://developer.woocommerce.com/docs/apis/store-api/cart-tokens/), [Cart API](https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/cart/), [Checkout API](https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/checkout), [Next.js guides](https://nextjs.org/docs/app/guides). A production commerce completion should use supported session/token and configured shipping/payment mechanisms instead of treating a local bag as a complete WC cart.
