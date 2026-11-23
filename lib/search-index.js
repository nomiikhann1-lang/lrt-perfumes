import { canonicalFamily, scentFamily } from './store-config.js';

export const normalizeSearch = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
export const canSearch = (query) => /\d/.test(query) || (normalizeSearch(query).match(/\p{L}/gu) || []).length >= 3;
const indexes = new WeakMap();

export function indexedSearch(products, query) {
  const normalized = normalizeSearch(query);
  if (!normalized) return products;
  if (!canSearch(normalized)) return [];
  if (!indexes.has(products)) {
    indexes.set(products, products.map((product) => {
      const text = normalizeSearch([product.name, product.sku, ...(product.variants || []).map(v => v.sku), product.brand, product.collection, product.family, scentFamily(product), product.gender, product.tag, ...(product.notes || [])].filter(Boolean).join(' '));
      return { product, text, tokens: new Set(text.match(/[\p{L}]+|\d+/gu) || []) };
    }));
  }
  const terms = normalized.match(/[\p{L}]+|\d+/gu) || [];
  if (!terms.length) return [];
  return indexes.get(products).filter(({ product, text, tokens }) => terms.every(term =>
    /^\d+$/.test(term) ? tokens.has(term) :
      (canonicalFamily(term) && canonicalFamily(term) === scentFamily(product)) || text.includes(term)
  )).map(entry => entry.product);
}
