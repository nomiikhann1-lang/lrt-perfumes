import { canonicalFamily } from "../../../lib/store-config";
import { getCatalog, pageMeta } from "../../../lib/seo";
import { collectionsFor } from "../../../lib/collections";
import { renderStore } from "../../../lib/render-store";
import { notFound, permanentRedirect } from "next/navigation";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = collectionsFor(await getCatalog()).find((c) => c.slug === slug);
  return pageMeta(
    c?.title || "Collection not found",
    c?.description || "Explore LRT Perfumes.",
    "/collection/" + slug,
    !c,
  );
}
export default async function Page({ params }) {
  const { slug } = await params;
  const family = canonicalFamily(slug);
  if (family && family.toLowerCase() !== slug)
    permanentRedirect("/collection/" + family.toLowerCase());
  if (slug === "all") permanentRedirect("/shop");
  const c = collectionsFor(await getCatalog()).find((c) => c.slug === slug);
  if (!c) notFound();
  if (c.group === "Brands") permanentRedirect("/brand/" + c.slug);
  return renderStore({
    view: "shop",
    collectionSlug: slug,
    collectionTitle: c.title,
    collectionDescription: c.description,
  });
}
