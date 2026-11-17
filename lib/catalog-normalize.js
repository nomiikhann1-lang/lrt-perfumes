import { scentFamily } from "./store-config.js";
const text = (v, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");
const number = (v) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
const stock = (v) => (Number.isInteger(v) && v >= 0 ? Math.min(v, 1000000) : 0);
export function safeImage(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password ? u.href : "";
  } catch {
    return "";
  }
}
export function normalizeProducts(data) {
  if (!Array.isArray(data) || data.length > 2000)
    throw new Error("Invalid catalogue.");
  const seen = new Set();
  return data.map((p) => {
    if (
      !Number.isSafeInteger(p?.id) ||
      p.id < 1 ||
      !text(p.name) ||
      !text(p.slug) ||
      /[/?#\\]/.test(p.slug) ||
      p.slug.length > 200 ||
      seen.has(p.id)
    )
      throw new Error("Invalid catalogue product.");
    seen.add(p.id);
    const result = {
      id: p.id,
      name: text(p.name, 200),
      slug: p.slug,
      description: text(p.description, 20000),
      color: /^#[a-f0-9]{3,8}$/i.test(p.color) ? p.color : "#c7b294",
      stock: stock(p.stock),
      image: safeImage(p.image),
      independentVariationStock: p.independentVariationStock === true,
    };
    for (const field of [
      "brand",
      "collection",
      "family",
      "scentFamily",
      "gender",
      "tag",
      "occasion",
      "season",
      "concentration",
      "ingredients",
      "care",
    ])
      result[field] = text(
        p[field],
        ["ingredients", "care"].includes(field) ? 5000 : 500,
      );
    result.family = result.scentFamily = scentFamily(p);
    result.notes = Array.isArray(p.notes)
      ? p.notes.slice(0, 3).map((v) => text(v, 1000))
      : [];
    result.images = Array.isArray(p.images)
      ? p.images
          .slice(0, 12)
          .map((v) => safeImage(typeof v === "string" ? v : v?.src))
          .filter(Boolean)
      : [];
    result.categories = Array.isArray(p.categories)
      ? p.categories
          .slice(0, 50)
          .filter((c) => typeof c?.name === "string")
          .map((c) => ({ name: text(c.name, 200), slug: text(c.slug, 200) }))
      : [];
    const sizes = new Set();
    result.variants = Array.isArray(p.variants)
      ? p.variants
          .slice(0, 100)
          .filter(
            (v) =>
              v &&
              Number.isInteger(v.size) &&
              v.size > 0 &&
              v.size <= 2000 &&
              !sizes.has(v.size) &&
              sizes.add(v.size),
          )
          .map((v) => ({
            size: v.size,
            variationId:
              Number.isSafeInteger(v.variationId) && v.variationId > 0
                ? v.variationId
                : null,
            stock: stock(v.stock),
            prices: { AED: number(v.prices?.AED), QAR: number(v.prices?.QAR) },
            image: safeImage(v.image),
          }))
      : [];
    result.sizes = result.variants.map((v) => v.size);
    return result;
  });
}
