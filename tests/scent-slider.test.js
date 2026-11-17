import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createScentSlides } from "../lib/scent-slider.js";
import { scentFamilies, scentFamily } from "../lib/store-config.js";
import { products } from "../lib/catalog.js";

test("home slider includes all ten families and their existing local images", () => {
  const slides = createScentSlides(products);
  assert.equal(slides.length, 10);
  assert.deepEqual(
    slides.map((slide) => slide.name),
    scentFamilies,
  );
  for (const slide of slides) {
    assert.ok(
      existsSync(new URL(`../public${slide.image}`, import.meta.url)),
      slide.image,
    );
    if (slide.product) {
      assert.equal(scentFamily(slide.product), slide.name);
      assert.equal(slide.href, `/collection/${slide.name.toLowerCase()}`);
    } else {
      assert.equal(
        new URL(slide.href, "https://example.com").searchParams.get("family"),
        slide.name,
      );
    }
  }
});

test("an empty catalogue preserves all families without inventing products", () => {
  const slides = createScentSlides([]);
  assert.equal(slides.length, 10);
  assert.ok(
    slides.every(
      (slide) => !slide.product && slide.href.startsWith("/shop?family="),
    ),
  );
});

test("canonical scent family takes priority when selecting a featured bottle", () => {
  const product = {
    name: "Test",
    scentFamily: "Sweet",
    family: "Woody",
    slug: "test",
  };
  const slides = createScentSlides([product]);
  assert.equal(slides.find((slide) => slide.name === "Sweet").product, product);
  assert.equal(
    slides.find((slide) => slide.name === "Woody").product,
    undefined,
  );
});
