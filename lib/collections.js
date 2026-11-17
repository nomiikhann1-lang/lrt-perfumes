import { canonicalFamily, scentFamilies, scentFamily } from "./store-config.js";
export const slugify = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const productBrand = (p) => p.brand?.trim() || "LRT Perfumes";
export const productCollection = (p) =>
  p.collection?.trim() || "Signature collection";
export function collectionsFor(products) {
  const list = [
    {
      slug: "all",
      title: "All perfumes",
      group: "Discover",
      description:
        "Every expression of LRT. Find the fragrance that feels like you.",
      match: () => true,
    },
    {
      slug: "new-arrivals",
      title: "New arrivals",
      group: "Discover",
      description: "Meet the latest additions to your scent wardrobe.",
      match: (p) => p.tag === "New",
    },
    {
      slug: "bestsellers",
      title: "Bestsellers",
      group: "Discover",
      description:
        "Discover the fragrances marked as favourites in our collection.",
      match: (p) => p.tag === "Bestseller",
    },
    ...["Women", "Men", "Unisex"].map((g) => ({
      slug: slugify(g),
      title: g === "Unisex" ? "Unisex perfumes" : g + "’s perfumes",
      group: "Shop by gender",
      description:
        "Explore " +
        g.toLowerCase() +
        " fragrances, from everyday signatures to special occasions.",
      match: (p) => p.gender === g,
    })),
    ...scentFamilies.map((f) => ({
      slug: slugify(f),
      title: f + " perfumes",
      group: "Scent families",
      description:
        "Discover the " + f.toLowerCase() + " side of your scent wardrobe.",
      match: (p) => scentFamily(p) === f,
    })),
  ];
  for (const [field, get, group] of [
    ["brand", productBrand, "Brands"],
    ["collection", productCollection, "Collections"],
  ])
    for (const name of [...new Set(products.map(get))]) {
      let slug = slugify(name);
      if (list.some((c) => c.slug === slug)) slug = field + "-" + slug;
      const base = slug;
      let suffix = 2;
      while (list.some((c) => c.slug === slug)) slug = base + "-" + suffix++;
      list.push({
        slug,
        title: name,
        group,
        description: "Explore " + name + " at LRT Perfumes.",
        match: (p) => get(p) === name,
      });
    }
  for (const name of [
    ...new Set(
      products
        .flatMap((p) => (p.categories || []).map((c) => c.name))
        .filter(Boolean),
    ),
  ]) {
    if (list.some((c) => c.title.toLowerCase() === name.toLowerCase()))
      continue;
    let slug = "category-" + slugify(name);
    if (list.some((c) => c.slug === slug)) continue;
    list.push({
      slug,
      title: name,
      group: "Collections",
      description: "Explore the " + name + " selection at LRT Perfumes.",
      match: (p) => (p.categories || []).some((c) => c.name === name),
    });
  }
  return list.filter((c) => products.some(c.match));
}
export function taxonomyHref(products, group, name) {
  const c = collectionsFor(products).find(
    (c) => c.group === group && c.title === name,
  );
  return c
    ? (group === "Brands" ? "/brand/" : "/collection/") + c.slug
    : "/collection";
}
export function collectionHref(f = "All", g = "All") {
  if (f === "All" && g === "All") return "/shop";
  if (g !== "All" && f === "All") return "/collection/" + slugify(g);
  if (["Saved", "Favorites"].includes(f)) return "/shop?family=Favorites";
  if (g === "All") {
    return "/collection/" + slugify(canonicalFamily(f) || f);
  }
  return (
    "/shop?family=" + encodeURIComponent(f) + "&gender=" + encodeURIComponent(g)
  );
}
