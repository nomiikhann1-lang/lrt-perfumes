import { priceFor, productSizes, searchProducts, stockFor } from "./catalog.js";
import { productBrand } from "./collections.js";
import { canonicalFamily, scentFamily } from "./store-config.js";
export const PAGE_SIZE = 40;
export const brandKey = (name) =>
  String(name || "")
    .trim()
    .toLocaleLowerCase("en");
export function filterCatalogue(
  products,
  {
    query = "",
    families = [],
    genders = [],
    brands = [],
    favorites = [],
    sort = "featured",
    currency = "QAR",
  } = {},
) {
  const selectedBrands = brands.map(brandKey);
  return searchProducts(products, query)
    .filter(
      (p) =>
        (!families.length ||
          families.some((f) =>
            ["Saved", "Favorites"].includes(f)
              ? favorites.includes(p.id)
              : Boolean(canonicalFamily(f)) &&
                scentFamily(p) === canonicalFamily(f),
          )) &&
        (!genders.length || genders.includes(p.gender)) &&
        (!brands.length || selectedBrands.includes(brandKey(productBrand(p)))),
    )
    .sort((a, b) => {
      const ap = priceFor(a, productSizes(a)[0], currency),
        bp = priceFor(b, productSizes(b)[0], currency);
      if (["low", "high"].includes(sort)) {
        if (ap === null) return bp === null ? a.id - b.id : 1;
        if (bp === null) return -1;
        return (sort === "low" ? ap - bp : bp - ap) || a.id - b.id;
      }
      if (sort === "name") return a.name.localeCompare(b.name) || a.id - b.id;
      if (sort === "newest") return b.id - a.id;
      if (sort === "best")
        return (
          Number(b.tag === "Bestseller") - Number(a.tag === "Bestseller") ||
          a.id - b.id
        );
      return a.id - b.id;
    });
}
export function sameBrandProducts(products, product, limit = 4) {
  const brand = brandKey(productBrand(product));
  return brand
    ? products
        .filter(
          (p) => p.id !== product.id && brandKey(productBrand(p)) === brand,
        )
        .slice(0, limit)
    : [];
}
export function addToBag(bag, p, size, qty, currency) {
  if (
    !Number.isInteger(qty) ||
    qty < 1 ||
    qty > 10 ||
    priceFor(p, size, currency) === null
  )
    throw Error("Choose an available size and quantity.");
  const existing = bag.find((i) => i.id === p.id && i.size === size),
    total = bag.filter((i) => i.id === p.id).reduce((n, i) => n + i.qty, 0);
  if (
    (existing?.qty || 0) + qty > Math.min(10, stockFor(p, size)) ||
    (!p.independentVariationStock && total + qty > p.stock)
  )
    throw Error("Maximum available quantity reached.");
  return existing
    ? bag.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i))
    : [...bag, { id: p.id, size, qty }];
}
export function productImages(p, size) {
  const v = p.variants?.find((v) => v.size === size);
  const candidates = [v?.image, ...(p.images || []), p.image]
    .map((i) => (typeof i === "string" ? { src: i, alt: p.name } : i))
    .filter(
      (i) =>
        i && typeof i.src === "string" && /^(https?:\/\/|\/[^/])/.test(i.src),
    );
  return [...new Map(candidates.map((i) => [i.src, i])).values()];
}
