import test from "node:test";
import assert from "node:assert/strict";
import {
  collectionsFor,
  collectionHref,
  taxonomyHref,
  perfumeNavigation,
} from "../lib/collections.js";
import { products } from "../lib/catalog.js";
test("collection routes separate gender, arrivals and scent families", () => {
  const c = collectionsFor(products);
  assert.deepEqual(
    products.filter(c.find((x) => x.slug === "men").match).map((p) => p.id),
    [6, 9],
  );
  assert.deepEqual(
    products
      .filter(c.find((x) => x.slug === "new-arrivals").match)
      .map((p) => p.id),
    [2, 7],
  );
  assert.equal(
    products.filter(c.find((x) => x.slug === "woody").match).length,
    4,
  );
  assert.equal(collectionHref("Floral"), "/collection/floral");
});

test("the three perfume destinations separate inspired and LRT fragrances", () => {
  const catalogue = [
    { id: 1, collection: "Inspired Edition" },
    { id: 2, collection: "Evening", categories: [{ name: "Inspired Editions", slug: "inspired-editions" }] },
    { id: 3, collection: "LRT Collection" },
    { id: 4, brand: "LRT Perfumes" },
  ];
  assert.deepEqual(perfumeNavigation.map((item) => item.title), ["Shop All", "Inspired Edition", "LRT Collection"]);
  const collections = collectionsFor(catalogue);
  assert.deepEqual(catalogue.filter(collections.find((item) => item.slug === "inspired-edition").match).map((p) => p.id), [1, 2]);
  assert.deepEqual(catalogue.filter(collections.find((item) => item.slug === "lrt-collection").match).map((p) => p.id), [3, 4]);
  assert.deepEqual(collectionsFor([]).map((item) => item.slug), ["inspired-edition", "lrt-collection"]);
});
test("new backend brands and collections get distinct clean routes", () => {
  const p = [
    ...products,
    { ...products[0], id: 100, brand: "New Brand", collection: "Evening Edit" },
  ];
  assert.equal(taxonomyHref(p, "Brands", "New Brand"), "/brand/new-brand");
  assert.equal(
    taxonomyHref(p, "Collections", "Evening Edit"),
    "/collection/evening-edit",
  );
  assert.equal(
    new Set(collectionsFor(p).map((c) => c.slug)).size,
    collectionsFor(p).length,
  );
});
