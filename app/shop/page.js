import { randomInt } from "node:crypto";
import { canonicalFamily } from "../../lib/store-config";
import { permanentRedirect } from "next/navigation";
import { collectionHref, collectionsFor } from "../../lib/collections";
import { pageMeta, getCatalog } from "../../lib/seo";
import { renderStore } from "../../lib/render-store";
export const dynamic = "force-dynamic";
export async function generateMetadata({ searchParams }) {
  const q = await searchParams;
  return pageMeta(
    "Shop perfumes by scent family",
    "Explore perfumes across the LRT scent families. Filter perfumes for women, men and everyone.",
    "/shop",
    Object.keys(q).length > 0,
  );
}
export default async function Page({ searchParams }) {
  const q = await searchParams;
  if (Object.keys(q).length === 1) {
    if (["Men", "Women", "Unisex"].includes(q.gender))
      permanentRedirect(collectionHref("All", q.gender));
    const family = canonicalFamily(q.family);
    if (
      family &&
      collectionsFor(await getCatalog()).some(
        (c) => c.slug === family.toLowerCase(),
      )
    )
      permanentRedirect(collectionHref(family));
    if (q.q === "New") permanentRedirect("/collection/new-arrivals");
    if (q.q === "Bestseller") permanentRedirect("/collection/bestsellers");
  }
  return renderStore({
    view: "shop",
    promotionSeed: randomInt(0x100000000),
    initialQuery: typeof q.q === "string" ? q.q.slice(0, 160) : "",
    initialFamily:
      typeof q.family === "string" ? q.family.slice(0, 100) : "All",
    initialGender: typeof q.gender === "string" ? q.gender.slice(0, 30) : "All",
  });
}
