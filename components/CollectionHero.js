import Link from "./StoreLink";
export default function CollectionHero({ collection }) {
  return collection ? <h1 className="collection-title">{collection.title}</h1> : null;
}
export function RelatedCollections({ collections, current }) {
  const related = collections
    .filter(
      (c) =>
        c.slug !== current?.slug && c.group !== "Brands" && c.slug !== "all",
    )
    .slice(0, 4);
  return related.length ? (
    <section className="related-collections">
      <h2>Another way to find your scent.</h2>
      <div>
        {related.map((c) => (
          <Link href={"/collection/" + c.slug} key={c.slug}>
            <span>{c.title}</span>

          </Link>
        ))}
      </div>
    </section>
  ) : null;
}
