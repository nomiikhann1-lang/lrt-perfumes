import test from "node:test";
import assert from "node:assert/strict";
import {
  products,
  searchProducts,
  priceFor,
  demoTotals,
} from "../lib/catalog.js";
import { scentFamilies, scentFamily } from "../lib/store-config.js";
const order = {
  firstName: "Test",
  lastName: "Buyer",
  email: "buyer@example.com",
  phone: "+971500000000",
  address: "Example building 1",
  country: "AE",
  city: "Dubai",
  payment: "cod",
  requestId: "test-order-123456",
  items: [{ id: 1, size: 50, qty: 1 }],
};
test("thirty unique sample products cover every family with at least two examples", () => {
  assert.equal(products.length, 30);
  assert.equal(new Set(products.map((p) => p.slug)).size, 30);
  assert.equal(new Set(products.map((p) => p.id)).size, 30);
  for (const family of scentFamilies)
    assert.ok(
      products.filter((p) => scentFamily(p) === family).length >= 2,
      family,
    );
  for (const p of products) {
    assert.equal(p.notes.length, 3);
    assert.deepEqual(p.sizes, [50, 100, 200]);
    assert.ok(p.stock > 0);
    for (const size of p.sizes)
      for (const currency of ["AED", "QAR"])
        assert.ok(priceFor(p, size, currency) > 0);
  }
});
test("search matches notes, accents, gender, family and multiple words", () => {
  assert.equal(searchProducts(products, "SAFFRON")[0].id, 1);
  assert.equal(searchProducts(products, "rose eclipse")[0].id, 2);
  assert.deepEqual(
    searchProducts(products.slice(0, 10), "oud unisex").map((p) => p.id),
    [3],
  );
  assert.equal(searchProducts(products, "impossible scent").length, 0);
});
test("prices calculated on server; submitted totals ignored", () => {
  assert.equal(priceFor(products[0], 100), 235);
  assert.equal(demoTotals({ ...order, total: 1 }).total, 145);
  assert.equal(
    demoTotals({ ...order, country: "QA", city: "Doha" }).total,
    129,
  );
  assert.equal(
    demoTotals({ ...order, items: [{ id: 1, size: 50, qty: 2 }] }).shipping,
    0,
  );
});

test("delivery is free in both markets without a minimum spend", () => {
  for (const [country, city] of [["AE", "Dubai"], ["QA", "Doha"]]) {
    const totals = demoTotals({ ...order, country, city });
    assert.equal(totals.shipping, 0);
    assert.equal(totals.total, totals.subtotal);
  }
});
test("reject manipulated quantities, sizes, locations and duplicate items", () => {
  for (const change of [
    { items: [{ id: 1, size: 50, qty: -1 }] },
    { items: [{ id: 1, size: 90, qty: 1 }] },
    { items: [{ id: 999, size: 50, qty: 1 }] },
    { city: "London" },
    { email: "bad" },
    { items: [...order.items, ...order.items] },
    { payment: "free" },
  ])
    assert.throws(() => demoTotals({ ...order, ...change }));
});
