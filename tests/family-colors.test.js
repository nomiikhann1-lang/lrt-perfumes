import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bottleColor, familyColors } from "../lib/store-config.js";
import { normalizeProducts } from "../lib/catalog-normalize.js";

test("all canonical families override a stale custom bottle colour", () => {
  for (const [scentFamily, color] of Object.entries(familyColors)) {
    const product = { id: 1, name: "Test", slug: "test", scentFamily, color: "#000000" };
    assert.equal(bottleColor(product), color);
    assert.equal(normalizeProducts([product])[0].color, color);
  }
  assert.equal(bottleColor({ family: "Warm", color: "#000000" }), familyColors.Amber);
  assert.equal(bottleColor({ scentFamily: "Sweet", family: "Woody" }), familyColors.Sweet);
  assert.equal(bottleColor({ scentFamily: "unknown", color: "#000000" }), "#c7b294");
});

test("WordPress and storefront share the same ten family colours", () => {
  const php = readFileSync(new URL("../wordpress/lrt-bridge/lrt-families.php", import.meta.url), "utf8");
  const colors = Object.fromEntries([...php.matchAll(/"(\w+)" => "(#[A-Fa-f0-9]{6})"/g)].map((match) => [match[1], match[2]]));
  assert.deepEqual(colors, familyColors);
});
