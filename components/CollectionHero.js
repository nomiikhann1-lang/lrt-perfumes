import Link from "./StoreLink";
import { ArrowUpRight } from "lucide-react";
export default function CollectionHero({ collection, products }) {
  if (!collection) return null;
  const match = products.filter(collection.match),
    image = match.find((p) => p.image)?.image;
  const isBrand = collection.group === "Brands";
  if (isBrand)
    return (
      <div className="brand-collection-heading">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/brand">Brands</Link>
          <span>/</span>
          <span aria-current="page">{collection.title}</span>
        </nav>
        <h1>{collection.title}</h1>
        <p>{match.length} fragrances</p>
      </div>
    );
  return (
    <div className={"collection-hero " + (image ? "with-image" : "")}>
      <div>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={isBrand ? "/brand" : "/collection"}>
            {isBrand ? "Brands" : "Collections"}
          </Link>
          <span>/</span>
          <span aria-current="page">{collection.title}</span>
        </nav>
        <span className="eyebrow">
          {isBrand ? "THE BRAND EDIT" : collection.group}
        </span>
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
        <span className="collection-count">
          {match.length} fragrances · Explore your next signature
        </span>
        {isBrand && (
          <small>
            Inspired editions are independent creations. Brand references do not
            imply affiliation.
          </small>
        )}
      </div>
      {image && (
        <div className="collection-hero-art">
          <img
            src={image}
            alt={match.find((p) => p.image === image).name}
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </div>
  );
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
      <span className="eyebrow">CONTINUE YOUR DISCOVERY</span>
      <h2>Another way to find your scent.</h2>
      <div>
        {related.map((c) => (
          <Link href={"/collection/" + c.slug} key={c.slug}>
            <span>{c.title}</span>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
    </section>
  ) : null;
}
