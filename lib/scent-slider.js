import { scentFamilies, scentFamily } from "./store-config.js";

const themes = {
  Leather: ["#C19D87", "Deep textures. Quiet confidence."],
  Aromatic: ["#ADC19B", "Green notes. A fresh perspective."],
  Amber: ["#D9BA83", "Warm notes. Lasting impressions."],
  Sweet: ["#DDA7BD", "A little sweetness, beautifully worn."],
  Fruity: ["#DCAA8A", "Bright notes. Playful possibilities."],
  Fresh: ["#9CBFBA", "A little light. A new beginning."],
  Citrus: ["#D4C782", "A brighter way to start your day."],
  Spicy: ["#CC9A92", "A warm spark of individuality."],
  Floral: ["#BCACD2", "A softer kind of statement."],
  Woody: ["#BDA695", "Grounded in something extraordinary."],
};

export function createScentSlides(products) {
  return scentFamilies.map((name) => {
    const product = products.find((item) => scentFamily(item) === name);
    const [color, description] = themes[name];
    return {
      name,
      color,
      description,
      product,
      image: `/scent-families/${name.toLowerCase()}.png`,
      href: product
        ? `/collection/${name.toLowerCase()}`
        : `/shop?family=${encodeURIComponent(name)}`,
    };
  });
}
