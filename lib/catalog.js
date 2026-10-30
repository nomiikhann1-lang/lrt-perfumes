import { markets, scentFamily } from "./store-config.js";
export const products = [
  {
    id: 1,
    name: "Saffron Veil",
    family: "Amber",
    gender: "Unisex",
    color: "#bb854b",
    notes: ["Saffron", "Jasmine", "Amberwood"],
    price: 145,
    sizes: [30, 50, 100],
    stock: 24,
    tag: "Bestseller",
    description:
      "A luminous opening of saffron settles into airy jasmine and the quiet warmth of amberwood. Golden, intimate, unforgettable.",
    occasion: "Evenings & special moments",
    season: "Autumn / Winter",
  },
  {
    id: 2,
    name: "Rose Éclipse",
    family: "Floral",
    gender: "Women",
    color: "#be817f",
    notes: ["Pink pepper", "Damask rose", "White musk"],
    price: 135,
    sizes: [30, 50, 75],
    stock: 18,
    tag: "New",
    description:
      "Dew-kissed rose with a spark of pink pepper. A soft veil of white musk stays close, like the memory of a beautiful evening.",
    occasion: "Everyday & date nights",
    season: "All seasons",
  },
  {
    id: 3,
    name: "Oud After Hours",
    family: "Oud",
    gender: "Unisex",
    color: "#69523d",
    notes: ["Cardamom", "Oud", "Sandalwood"],
    price: 185,
    sizes: [30, 50, 100],
    stock: 12,
    tag: "Signature",
    description:
      "Rich oud meets freshly crushed cardamom and creamy sandalwood. A deep, contemplative scent with a beautifully smooth finish.",
    occasion: "Evenings & celebrations",
    season: "Autumn / Winter",
  },
  {
    id: 4,
    name: "Citrus Reverie",
    family: "Fresh",
    gender: "Unisex",
    color: "#a9ae75",
    notes: ["Bergamot", "Neroli", "Vetiver"],
    price: 115,
    sizes: [30, 50, 100],
    stock: 32,
    tag: "Bestseller",
    description:
      "Sunlight through an open window. Bright bergamot, green neroli and dry vetiver create an effortless, freshly washed feeling.",
    occasion: "Daytime & office",
    season: "Spring / Summer",
  },
  {
    id: 5,
    name: "Vanilla Muse",
    family: "Gourmand",
    gender: "Women",
    color: "#c5a272",
    notes: ["Pear", "Vanilla", "Tonka bean"],
    price: 140,
    sizes: [30, 50, 100],
    stock: 21,
    tag: "",
    description:
      "Juicy pear gives way to enveloping vanilla and velvety tonka. Comforting sweetness with a polished, grown-up edge.",
    occasion: "Everyday & evenings",
    season: "Autumn / Winter",
  },
  {
    id: 6,
    name: "Cedar Society",
    family: "Woody",
    gender: "Men",
    color: "#8c987e",
    notes: ["Grapefruit", "Cedarwood", "Patchouli"],
    price: 150,
    sizes: [30, 50, 100],
    stock: 19,
    tag: "",
    description:
      "Crisp grapefruit over tailored cedarwood and earthy patchouli. Clean lines, warm woods and understated confidence.",
    occasion: "Office & evenings",
    season: "All seasons",
  },
  {
    id: 7,
    name: "Neroli Coast",
    family: "Fresh",
    gender: "Unisex",
    color: "#afbdaf",
    notes: ["Mandarin", "Neroli", "Sea salt"],
    price: 125,
    sizes: [30, 50, 75],
    stock: 28,
    tag: "New",
    description:
      "A salty breeze through citrus groves. Sparkling mandarin and delicate neroli capture the ease of a slow coastal morning.",
    occasion: "Daytime & weekends",
    season: "Spring / Summer",
  },
  {
    id: 8,
    name: "Velvet Iris",
    family: "Floral",
    gender: "Women",
    color: "#aaa0b0",
    notes: ["Violet", "Iris", "Musk"],
    price: 155,
    sizes: [30, 50, 100],
    stock: 16,
    tag: "",
    description:
      "Powder-soft iris and violet unfold over a clean musk base. Elegant, tactile and as comforting as your favourite knit.",
    occasion: "Office & intimate occasions",
    season: "All seasons",
  },
  {
    id: 9,
    name: "Midnight Ember",
    family: "Amber",
    gender: "Men",
    color: "#986946",
    notes: ["Black pepper", "Incense", "Amber"],
    price: 165,
    sizes: [30, 50, 100],
    stock: 14,
    tag: "",
    description:
      "A flicker of pepper, a trail of incense, a warm amber glow. A quietly dramatic fragrance for the hours after sunset.",
    occasion: "Evenings & formal occasions",
    season: "Autumn / Winter",
  },
  {
    id: 10,
    name: "Pistachio Daydream",
    family: "Gourmand",
    gender: "Unisex",
    color: "#a5b48b",
    notes: ["Pistachio", "Orange blossom", "Praline"],
    price: 145,
    sizes: [30, 50, 75],
    stock: 20,
    tag: "Limited edit",
    description:
      "Roasted pistachio and airy orange blossom melt into a soft praline finish. Playful, creamy and unexpectedly sophisticated.",
    occasion: "Weekends & casual outings",
    season: "Spring / Autumn",
  },
].map((p) => ({
  ...p,
  sizes: [50, 100, 200],
  variants: [50, 100, 200].map((size, i) => ({
    size,
    variationId: null,
    stock: p.stock,
    prices: {
      AED: [
        [145, 235, 375],
        [135, 215, 345],
        [185, 295, 475],
        [115, 185, 295],
        [140, 225, 355],
        [150, 245, 395],
        [125, 205, 325],
        [155, 255, 415],
        [165, 265, 435],
        [145, 235, 375],
      ][p.id - 1][i],
      QAR: [
        [129, 209, 339],
        [119, 195, 315],
        [169, 275, 445],
        [99, 169, 269],
        [125, 205, 325],
        [139, 225, 365],
        [109, 185, 299],
        [145, 235, 385],
        [149, 245, 399],
        [129, 209, 339],
      ][p.id - 1][i],
    },
  })),
  scentFamily:
    { Floral: "Flowery", Woody: "Earthy", Oud: "Earthy", Amber: "Warm" }[
      p.family
    ] || (p.id === 7 ? "Herbal" : p.family),
  slug: p.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-"),
  concentration: "Oil-based perfume",
  ingredients:
    "Alcohol Denat., Parfum (Fragrance), Aqua (Water). Sample formula; final ingredient and allergen labels must be supplied before sale.",
  care: "Store away from heat and direct sunlight. For external use only. Avoid eyes and broken skin. Keep away from children and flames.",
}));
export const cities = {
  AE: [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ],
  QA: ["Doha", "Al Rayyan", "Lusail", "Al Wakrah", "Al Khor"],
};
export function priceFor(p, size, currency = "AED") {
  const v = p.variants?.find((v) => v.size === size);
  const n = v?.prices?.[currency];
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}
export function stockFor(p, size) {
  return p.variants?.find((v) => v.size === size)?.stock ?? 0;
}
export function productSizes(p) {
  return [
    ...new Set(
      (p.variants || [])
        .map((v) => v.size)
        .filter((s) => Number.isInteger(s) && s > 0 && s <= 2000),
    ),
  ].sort((a, b) => a - b);
}
export function searchProducts(list, q) {
  const terms = q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .split(/\s+/);
  return list.filter((p) =>
    terms.every((t) =>
      [p.name, p.family, scentFamily(p), p.gender, p.tag, ...(p.notes || [])]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(t),
    ),
  );
}
export function validateOrder(body) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !Array.isArray(body.items) ||
    !body.items.length ||
    body.items.length > 30
  )
    throw new Error("Your bag is empty or invalid.");
  if (
    typeof body.country !== "string" ||
    !Object.hasOwn(cities, body.country) ||
    !cities[body.country].includes(body.city)
  )
    throw new Error("Choose a supported delivery city.");
  if (!["cod", "card"].includes(body.payment))
    throw new Error("Choose a payment method.");
  for (const k of ["firstName", "lastName", "address", "phone"])
    if (
      typeof body[k] !== "string" ||
      body[k].trim().length < 2 ||
      body[k].length > 200
    )
      throw new Error("Complete your delivery details.");
  if (
    typeof body.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email || "") ||
    body.email.length > 200
  )
    throw new Error("Enter a valid email.");
  if (!/^[\d+()\s-]{7,24}$/.test(body.phone))
    throw new Error("Enter a valid phone number.");
  if (
    typeof body.requestId !== "string" ||
    !/^[a-zA-Z0-9-]{10,80}$/.test(body.requestId || "")
  )
    throw new Error("Invalid checkout reference.");
  if (
    body.note !== undefined &&
    (typeof body.note !== "string" || body.note.length > 500)
  )
    throw new Error("Order note is too long.");
  const seen = new Set();
  for (const item of body.items) {
    if (
      !item ||
      typeof item !== "object" ||
      !Number.isSafeInteger(item.id) ||
      item.id < 1 ||
      !Number.isInteger(item.size) ||
      item.size < 1 ||
      item.size > 2000 ||
      !Number.isInteger(item.qty) ||
      item.qty < 1 ||
      item.qty > 10
    )
      throw new Error("Invalid item quantity.");
    const key = item.id + ":" + item.size;
    if (seen.has(key)) throw new Error("Duplicate bag item.");
    seen.add(key);
  }
  return body;
}
export function demoTotals(body) {
  validateOrder(body);
  const currency = markets[body.country].currency;
  if (body.currency && body.currency !== currency)
    throw new Error("Currency does not match delivery country.");
  let subtotal = 0;
  const counts = {};
  for (const item of body.items) {
    const p = products.find((p) => p.id === item.id);
    const unit = p ? priceFor(p, item.size, currency) : null;
    if (
      !p ||
      !productSizes(p).includes(item.size) ||
      unit === null ||
      item.qty > stockFor(p, item.size)
    )
      throw new Error("A product or market price is unavailable.");
    counts[p.id] = (counts[p.id] || 0) + item.qty;
    if (counts[p.id] > p.stock)
      throw new Error("Requested quantity exceeds stock.");
    subtotal += unit * item.qty;
  }
  const market = markets[body.country];
  const shipping = subtotal >= market.freeAt ? 0 : market.shipping;
  return { subtotal, shipping, total: subtotal + shipping, currency };
}
