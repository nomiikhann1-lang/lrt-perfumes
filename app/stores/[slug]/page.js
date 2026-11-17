import { notFound } from "next/navigation";
import { stores } from "../../../lib/story-content";
import { renderStore } from "../../../lib/render-store";
import { pageMeta } from "../../../lib/seo";
async function resolveStore(params) {
  const { slug } = await params,
    store = stores.find((item) => item.slug === slug);
  if (!store) notFound();
  return store;
}
export async function generateMetadata({ params }) {
  const store = await resolveStore(params);
  return pageMeta(
    "LRT Perfumes " + store.name + " · " + store.area,
    store.intro,
    "/stores/" + store.slug,
  );
}
export default async function Page({ params }) {
  const store = await resolveStore(params);
  return renderStore({ view: "store", storeSlug: store.slug });
}
