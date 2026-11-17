export const pageContent = {
  about: {
    title: "Our story",
    intro:
      "Discover LRT Perfumes, founded in Qatar in 2020, and find our five perfume stores across Qatar and Dubai.",
    sections: [
      [
        "Inspired by the scents you love",
        "Explore inspired fragrances and custom perfume possibilities with LRT Perfumes. A personal scent starts with the notes, memories and moods that speak to you.",
      ],
      [
        "Find us in Qatar & the UAE",
        "Visit our listed locations in Souq Waqif, Doha; Al Wakrah Old Souq; Downtown Souq, Al Khor; and Al Karama, Dubai. Contact us before travelling to confirm opening hours and the exact shop location.",
      ],
      [
        "Explore this collection",
        "This development storefront contains ten illustrative fragrances. Product names, notes, prices and inventory are sample data, ready to replace through the connected WooCommerce dashboard.",
      ],
    ],
  },
  contact: {
    title: "Let’s talk fragrance.",
    intro:
      "Need help choosing a scent or finding a store? Reach the LRT team on +974 3010 0850.",
    sections: [
      [
        "Qatar",
        "Souq Waqif, Doha · Al Wakrah Old Souq · Downtown Souq, Al Khor.",
      ],
      [
        "United Arab Emirates",
        "Al Karama, Dubai. Please call to confirm shop details and opening hours.",
      ],
      [
        "Your next signature",
        "Ask the team about inspired editions, custom perfumes and current availability. WhatsApp opens a conversation with LRT; no message is sent automatically.",
      ],
    ],
  },
  faq: {
    title: "Good questions. Clear answers.",
    intro: "Everything you need for your first discovery.",
    sections: [
      [
        "Are these real products?",
        "The ten fragrances in this test site are illustrative. LRT’s current collection is available on lrtperfumes.com and through the store team.",
      ],
      [
        "Where do you deliver?",
        "The test checkout supports major UAE and Qatar cities. Confirm actual coverage and shipping charges with LRT before placing a live order.",
      ],
      [
        "How do I choose a scent?",
        "Search by fragrance name, note or family. Try bergamot for a bright scent, rose for a floral mood, or oud for a richer character.",
      ],
      [
        "Can I pay by card or cash?",
        "Both methods are available in the demo. Connected card orders redirect to the WooCommerce payment page. Live payment methods depend on the configured gateway.",
      ],
    ],
  },
  shipping: {
    title: "From our world to yours.",
    intro: "Delivery information for Qatar and the UAE.",
    sections: [
      [
        "Qatar delivery",
        "LRT’s existing website advertises free shipping across Qatar. Contact the team for current conditions and delivery times.",
      ],
      [
        "UAE delivery",
        "LRT lists an Al Karama, Dubai location. Confirm delivery coverage, charges and timing with the store.",
      ],
      [
        "Test checkout rates",
        "This development build retains the original testing rules: UAE AED 20, Qatar AED 35, complimentary shipping from AED 250. All test amounts are AED. These are sample rules, not LRT’s published shipping policy. Configure the live WooCommerce currency and shipping rules before launch.",
      ],
    ],
  },
  returns: {
    title: "Returns, with care.",
    intro: "Contact the LRT team for assistance with an order.",
    sections: [
      [
        "Start with your order details",
        "Have your order number and a description of the issue ready. For a damaged or incorrect item, keep the packaging and take clear photos. Contact +974 3010 0850.",
      ],
      [
        "Eligibility & refunds",
        "Return windows, eligibility and refund timing must be confirmed with LRT. This test storefront does not establish a new return promise. Consult the current Return & Refund Policy on lrtperfumes.com before a live purchase.",
      ],
      [
        "Demo purchases",
        "Test orders do not collect money or ship products and therefore do not create a refund transaction.",
      ],
    ],
  },
  "fragrance-guide": {
    title: "Follow your notes.",
    intro: "There is no single signature. Discover every side of yours.",
    sections: [
      [
        "Fresh & floral",
        "Citrus, neroli and light green notes feel bright and airy. Rose, jasmine and iris bring a floral character, from soft and powdery to expressive and rich.",
      ],
      [
        "Woody, amber & oud",
        "Cedar and sandalwood create a grounded impression. Amber adds warmth, while oud brings depth. Try these families when you want a more enveloping scent.",
      ],
      [
        "Gourmand",
        "Vanilla, praline and pistachio suggest familiar sweetness. Explore the notes and choose the level of warmth that suits your mood.",
      ],
      [
        "Wear & care",
        "Apply lightly, let the fragrance settle and avoid rubbing. Keep bottles away from heat, direct sunlight and flames. Avoid eyes and irritated skin; discontinue use if irritation occurs.",
      ],
    ],
  },
  privacy: {
    title: "Your privacy.",
    intro:
      "Development-store privacy notice. Final business policies must be approved before launch.",
    sections: [
      [
        "On this device",
        "The site stores your bag, favourites and recent searches in browser local storage. Clear your browser’s site data to remove these preferences.",
      ],
      [
        "Checkout data",
        "Standalone checkout sends entered details to the test API for validation and does not create a real order. Once WordPress is connected, checkout details are sent to that store to fulfil orders. Use sample information for testing.",
      ],
      [
        "Payments & external services",
        "Card details are entered only on the configured payment provider page. WhatsApp links are governed by those services’ policies.",
      ],
      [
        "Questions",
        "Contact LRT on +974 3010 0850. The final policy must identify the responsible business, retention periods, applicable rights and any production analytics.",
      ],
    ],
  },
  terms: {
    title: "Terms of this test store.",
    intro: "This website is a development demonstration for LRT Perfumes.",
    sections: [
      [
        "Sample catalog",
        "Product descriptions, formulas, prices, availability and delivery estimates are illustrative. They are not an offer to sell until the store is configured and approved for live operation.",
      ],
      [
        "Orders & payment",
        "Demo checkout is a simulation. Connected WooCommerce orders and payments require a running store, configured gateways, final prices and business-approved policies.",
      ],
      [
        "Before launch",
        "The business must confirm its currency, taxes, shipping, returns, contact details and applicable legal terms. Refer to lrtperfumes.com for the existing store’s published policies.",
      ],
    ],
  },
  disclaimer: {
    title: "A note on inspired fragrance.",
    intro: "A development storefront with an illustrative catalog.",
    sections: [
      [
        "Independent identity",
        "LRT Perfumes is the brand presented here. References to other fragrance houses on the existing business website describe scent inspiration; this build makes no claim of endorsement or affiliation.",
      ],
      [
        "Sample information",
        "The preview products shown here are fictional development examples. Ingredients, performance and stock must be replaced with verified information before sale.",
      ],
    ],
  },
};

// Central draft content shared by every viewport.
Object.assign(pageContent, {
  "payment-methods": {
    title: "Ways to pay.",
    intro: "Choose an available payment method at checkout.",
    sections: [
      [
        "Cards",
        "Card payments continue to the connected WooCommerce payment page. Available brands and currencies depend on the configured provider. [CONFIRM ACCEPTED PAYMENT METHODS]",
      ],
      [
        "Cash on delivery",
        "Availability depends on your delivery location and the store’s payment configuration. [CONFIRM COD COVERAGE AND FEES]",
      ],
      [
        "Payment support",
        "If payment is interrupted, keep your order reference and contact the team before trying again. Never send card numbers or security codes to customer support.",
      ],
    ],
  },
  stores: {
    title: "Find your nearest LRT.",
    intro: "Discover fragrances with our team in Qatar and the UAE.",
    sections: [
      [
        "Qatar",
        "Locations listed in the existing project: Souq Waqif, Doha; Old Souq, Al Wakrah; Downtown Souq, Al Khor. [CONFIRM STORE ADDRESS AND OPENING HOURS]",
      ],
      [
        "United Arab Emirates",
        "The existing project lists Al Karama, Dubai. [CONFIRM STORE ADDRESS AND OPENING HOURS]",
      ],
      [
        "Plan your visit",
        "Contact the team through the Contact page before travelling. A live map and location-specific directions will be added after the addresses are confirmed.",
      ],
    ],
  },
  "product-care": {
    title: "Care for your fragrance.",
    intro: "A few small habits help preserve your bottle.",
    sections: [
      [
        "Storage",
        "Keep the bottle upright, closed and away from heat and direct sunlight. Follow the storage instructions on its label.",
      ],
      [
        "Application",
        "Follow the product label. Avoid contact with eyes and irritated skin, and discontinue use if irritation occurs.",
      ],
      [
        "Ingredients",
        "Consult the ingredient and allergen information on the actual packaging. Contact the team if you need the label before purchasing.",
      ],
    ],
  },
  accessibility: {
    title: "An experience for everyone.",
    intro: "We are working to make LRT easier to browse and shop.",
    sections: [
      [
        "Using this website",
        "Use the Skip to content link, keyboard navigation and visible focus indicators. Dialogs support Escape and keyboard focus. Reduced-motion preferences are respected.",
      ],
      [
        "Need assistance?",
        "Use the Contact page to tell us which page or action caused difficulty and what device or assistive technology you use. [ADD ACCESSIBILITY SUPPORT EMAIL]",
      ],
      [
        "Ongoing review",
        "This is a draft accessibility statement, not a claim of WCAG certification. Checkout and external payment services require separate accessibility testing.",
      ],
    ],
  },
  shipping: {
    title: "Delivered with care.",
    intro:
      "Delivery information for Qatar and the UAE — draft awaiting business approval.",
    sections: [
      [
        "Delivery coverage",
        "[CONFIRM DELIVERY AREAS] Contact the team if your city is not available during checkout.",
      ],
      [
        "Fees and timing",
        "[CONFIRM SHIPPING FEES] [CONFIRM DELIVERY ESTIMATES] The preview uses QAR 0 for Qatar and AED 20 for UAE, waived from AED 250. These testing rules must be reconciled with WooCommerce before launch.",
      ],
      [
        "Order updates",
        "Keep your order reference for support. [CONFIRM DISPATCH NOTIFICATIONS AND TRACKING PROVIDER]",
      ],
    ],
  },
  returns: {
    title: "Returns, with care.",
    intro: "Draft returns information for business and legal review.",
    sections: [
      [
        "Contact us first",
        "Provide your order number and a description of the issue through the Contact page. Keep the packaging and photographs for damaged or incorrect deliveries.",
      ],
      [
        "Eligibility",
        "[CONFIRM RETURN CONDITIONS AND DEADLINES] The existing project contains conflicting exchange guidance; no new return promise is established here.",
      ],
      [
        "Refunds",
        "[CONFIRM REFUND TIMING, METHOD AND RETURN SHIPPING FEES] Approved refunds must follow the actual payment and order workflow.",
      ],
    ],
  },
  privacy: {
    title: "Your privacy matters.",
    intro:
      "Draft privacy notice — requires business and legal approval before launch.",
    sections: [
      [
        "Who is responsible",
        "[CONFIRM LEGAL BUSINESS NAME] [CONFIRM REGISTERED ADDRESS] [ADD CUSTOMER SUPPORT EMAIL]",
      ],
      [
        "Shopping information",
        "Your bag, saved fragrances, market and recent searches are stored on this device. The consent cookie records essential-only or all-cookies preference. No optional trackers are installed in this package. Use Manage cookie preferences on this page to change your choice.",
      ],
      [
        "Orders and providers",
        "Checkout sends contact, address and order details to the commerce service. Card details are entered with the configured payment provider, not this storefront. [CONFIRM PAYMENT, DELIVERY AND HOSTING PROVIDERS]",
      ],
      [
        "Retention and requests",
        "[CONFIRM RETENTION PERIODS, APPLICABLE RIGHTS AND REQUEST PROCESS] Contact the business to ask about your information. Clear site data in your browser to remove local shopping preferences.",
      ],
    ],
  },
  terms: {
    title: "Terms & conditions.",
    intro: "Draft terms for business and legal review.",
    sections: [
      [
        "The seller",
        "[CONFIRM LEGAL BUSINESS NAME] [CONFIRM REGISTERED ADDRESS] [CONFIRM GOVERNING LAW FOR EACH MARKET]",
      ],
      [
        "Products and orders",
        "Availability and final amounts must be validated by the commerce service. [CONFIRM ORDER ACCEPTANCE, PRICING AND CANCELLATION TERMS] Demo orders do not create a purchase.",
      ],
      [
        "Payment and delivery",
        "Read Payment methods, Delivery, and Returns before ordering. [CONFIRM TAX TREATMENT AND TERMS OF SALE] These drafts must match the configured checkout before live use.",
      ],
    ],
  },
});
