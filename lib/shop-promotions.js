// Campaigns rotate in this order. Add your MP4 and poster to public/.
export const shopPromotions = [
  {
    title: "",
    button: "Explore collections",
    href: "/collection",
    src: "/Campaign-six.mp4",
    mobileSrc: "/campaign-film.mp4",
    poster: "/campaign-six.webp",
    mobilePoster: "/campaign-wide.webp",
  },
  {
    title: "In full bloom",
    button: "Shop floral",
    href: "/collection/floral",
    src: "/floral-film.mp4",
    poster: "/hero-mobile.webp",
  },
];
// Tile numbers include earlier videos. Choose an edge of every second or third
// desktop row, after row one. A server seed keeps positions stable on scroll.
export function promotionSlots(productCount, campaigns, seed) {
  const slots = new Map();
  if (!campaigns.length) return slots;
  let state = seed >>> 0,
    row = 1;
  function next() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  }
  for (let count = 0; ; count++) {
    const tile = row * 4 + (next() < 0.5 ? 1 : 4),
      index = tile - 1 - count;
    if (index >= productCount) break;
    slots.set(index, campaigns[count % campaigns.length]);
    row += 2 + Math.floor(next() * 2);
  }
  return slots;
}
