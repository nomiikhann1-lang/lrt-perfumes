export const markets = {
  AE: {
    currency: "AED",
    label: "United Arab Emirates",
    flag: "/flags/ae.svg",
    shipping: 20,
    freeAt: 250,
  },
  QA: {
    currency: "QAR",
    label: "Qatar",
    flag: "/flags/qa.svg",
    shipping: 0,
    freeAt: 0,
  },
};
export const familyColors = {
  Leather: "#BC5F28",
  Aromatic: "#4BBB0F",
  Amber: "#FDB813",
  Sweet: "#FE9EC4",
  Fruity: "#FE9004",
  Fresh: "#03E6F5",
  Citrus: "#FEE703",
  Spicy: "#FA2423",
  Floral: "#A153DA",
  Woody: "#E9B199",
};
export const scentFamilies = Object.keys(familyColors);
const oldNames = {
  Flowery: "Floral",
  Earthy: "Woody",
  Oud: "Woody",
  Herbal: "Aromatic",
  Warm: "Amber",
  Gourmand: "Sweet",
};
export function canonicalFamily(value) {
  const name = typeof value === "string" ? value.trim().toLowerCase() : "";
  return (
    scentFamilies.find((f) => f.toLowerCase() === name) ||
    Object.entries(oldNames).find(
      ([alias]) => alias.toLowerCase() === name,
    )?.[1] ||
    ""
  );
}
export function scentFamily(product) {
  return (
    canonicalFamily(product.scentFamily) || canonicalFamily(product.family)
  );
}
export function bottleColor(product) {
  return familyColors[scentFamily(product)] || "#c7b294";
}
