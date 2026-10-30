import { collectionsFor } from "./collections";
import Storefront from "../components/Storefront";
import { getCatalog, JsonLd, siteUrl } from "./seo";
import { connected } from "./wordpress";
import { notFound } from "next/navigation";
export async function renderStore(props = {}) {
  let catalog = [],
    error = "";
  const mode = connected() ? "wordpress" : "demo";
  try {
    catalog = await getCatalog();
  } catch {
    error =
      "The catalogue is temporarily unavailable. Please try again shortly.";
  }
  if (
    props.view === "product" &&
    !error &&
    !catalog.some((p) => p.slug === props.productSlug)
  )
    notFound();
  const product = catalog.find((p) => p.slug === props.productSlug);
  const offers = product?.variants
    ?.filter((v) => typeof v.prices?.QAR === "number")
    .map((v) => ({
      "@type": "Offer",
      name: product.name + " — " + v.size + " ml",
      priceCurrency: "QAR",
      price: v.prices.QAR,
      availability:
        "https://schema.org/" + (v.stock > 0 ? "InStock" : "OutOfStock"),
      url: siteUrl + "/product/" + product.slug,
    }));
  const collection = collectionsFor(catalog).find(
    (c) => c.slug === props.collectionSlug,
  );
  const collectionPath = collection
    ? (collection.group === "Brands" ? "/brand/" : "/collection/") +
      collection.slug
    : "/shop";
  return (
    <>
      {collection && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: collection.title,
            description: collection.description,
            url: siteUrl + collectionPath,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: catalog
                .filter(collection.match)
                .map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: siteUrl + "/product/" + p.slug,
                  name: p.name,
                })),
            },
          }}
        />
      )}
      {product && connected() && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: product.image || undefined,
              ...(product.brand
                ? { brand: { "@type": "Brand", name: product.brand } }
                : {}),
              url: siteUrl + "/product/" + product.slug,
              offers,
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                ["Home", ""],
                ["Perfumes", "/shop"],
                [product.name, "/product/" + product.slug],
              ].map(([name, path], i) => ({
                "@type": "ListItem",
                position: i + 1,
                name,
                item: siteUrl + path,
              })),
            }}
          />
        </>
      )}
      <Storefront
        key={JSON.stringify(props)}
        commerceEnabled={process.env.COMMERCE_ENABLED === "true"}
        initialProducts={catalog}
        initialMode={mode}
        initialError={error}
        {...props}
      />
    </>
  );
}
