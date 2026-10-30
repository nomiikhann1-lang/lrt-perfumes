import { unstable_cache } from "next/cache.js";
import { normalizeProducts } from "./catalog-normalize.js";
export { normalizeProducts } from "./catalog-normalize.js";
import { products } from "./catalog.js";
import { connected, wp } from "./wordpress.js";
// One bounded cache per Node process. Checkout always reads fresh WooCommerce data.
export function createCatalogCache(
  fetcher,
  { now = Date.now, ttl = 60000, cooldown = 15000 } = {},
) {
  let value,
    expires = 0,
    pending,
    failedUntil = 0;
  return async function read() {
    if (value && now() < expires) return value;
    if (pending) return pending;
    if (now() < failedUntil)
      throw new Error("Catalogue temporarily unavailable.");
    pending = (async () => {
      try {
        const data = await fetcher();
        if (!Array.isArray(data)) throw new Error("Invalid catalogue.");
        value = data;
        expires = now() + ttl;
        return value;
      } catch (e) {
        failedUntil = now() + cooldown;
        throw e;
      } finally {
        pending = null;
      }
    })();
    return pending;
  };
}
async function fetchCatalog() {
  const all = [];
  const deadline = Date.now() + 20000;
  for (let page = 1; page <= 20; page++) {
    const remaining = deadline - Date.now();
    if (remaining < 1) throw new Error("Catalogue timed out.");
    const data = await wp("products?page=" + page, undefined, {
      timeout: Math.min(12000, remaining),
    });
    if (Array.isArray(data)) {
      if (data.length >= 100)
        throw new Error(
          "Update the LRT bridge to support catalogue pagination.",
        );
      return normalizeProducts(data);
    }
    if (
      !Array.isArray(data?.products) ||
      !Number.isInteger(data.totalPages) ||
      data.totalPages < 0 ||
      data.totalPages > 20
    )
      throw new Error("Invalid catalogue pagination.");
    all.push(...data.products);
    if (page >= data.totalPages) return normalizeProducts(all);
  }
  throw new Error("Catalogue exceeds the configured pagination limit.");
}
const persistent = unstable_cache(
  fetchCatalog,
  ["lrt-catalog-v10", process.env.WORDPRESS_URL || "unconfigured"],
  { revalidate: 60, tags: ["catalog"] },
);
const read = createCatalogCache(
  process.env.VERCEL === "1" ? persistent : fetchCatalog,
);
export const readCatalog = () => {
  if (connected()) return read();
  if (
    process.env.WORDPRESS_URL ||
    process.env.LRT_API_SECRET ||
    (process.env.VERCEL === "1" && process.env.ENABLE_DEMO !== "true")
  )
    return Promise.reject(new Error("Store configuration unavailable."));
  return Promise.resolve(products);
};
