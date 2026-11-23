import test from 'node:test';
import assert from 'node:assert/strict';
import { indexedSearch, canSearch } from '../lib/search-index.js';
import { normalizeProducts } from '../lib/catalog-normalize.js';

const products = [
  { id: 1, name: 'Edition 1', sku: 'LRT-1', brand: 'Example House', notes: ['Rose'], variants: [{ sku: 'ROSE-1-50' }] },
  { id: 2, name: 'Edition 10', sku: 'LRT-10', notes: ['Musk'] },
  { id: 3, name: 'Edition 100', sku: 'LRT-100', notes: ['Vanilla'] },
  { id: 4, name: 'Éclat', sku: 'LRT-001', notes: ['Bergamot'] },
];
test('search waits for three letters but accepts exact numeric tokens immediately', () => {
  assert.equal(canSearch('ro'), false);
  assert.equal(canSearch('r--'), false);
  assert.equal(canSearch('a b'), false);
  assert.deepEqual(indexedSearch(products, 'ro'), []);
  assert.deepEqual(indexedSearch(products, '1').map(p => p.id), [1]);
  assert.deepEqual(indexedSearch(products, '10').map(p => p.id), [2]);
  assert.deepEqual(indexedSearch(products, '001').map(p => p.id), [4]);
  assert.deepEqual(indexedSearch(products, 'LRT-1').map(p => p.id), [1]);
  assert.deepEqual(indexedSearch(products, 'ROSE-1-50').map(p => p.id), [1]);
  assert.deepEqual(indexedSearch(products, '!!!'), []);
});
test('index supports accents, notes, brands, multiple terms and empty catalogue queries', () => {
  assert.deepEqual(indexedSearch(products, 'eclat').map(p => p.id), [4]);
  assert.deepEqual(indexedSearch(products, 'example rose').map(p => p.id), [1]);
  assert.deepEqual(indexedSearch(products, ''), products);
});
test('parent and variation SKUs survive catalogue normalization with length limits', () => {
  const [product] = normalizeProducts([{ ...products[0], slug: 'edition-1', variants: [{ size: 50, sku: 'ROSE-1-50' }] }]);
  assert.equal(product.sku, 'LRT-1');
  assert.equal(product.variants[0].sku, 'ROSE-1-50');
});
