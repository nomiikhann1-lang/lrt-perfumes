"use client";
import { useState } from "react";
import Link from "./StoreLink";
import { ArrowUpRight, Search } from "lucide-react";
import { collectionsFor } from "../lib/collections";
export default function BrandDirectory({ products }) {
  const [query, setQuery] = useState("");
  const brands = collectionsFor(products)
    .filter((c) => c.group === "Brands")
    .sort((a, b) => a.title.localeCompare(b.title));
  const shown = brands.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase().trim()),
  );
  return (
    <section className="brand-directory">
      <div className="brand-intro brand-intro-simple">
        <h1>Brands</h1>
      </div>
      <label className="brand-search">
        <Search size={18} />
        <span className="sr-only">Find a brand</span>
        <input
          type="search"
          placeholder="Find your favorite brand"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span>{shown.length} brands</span>
      </label>
      <div className="brand-grid">
        {shown.map((b, i) => (
          <Link className="brand-tile" key={b.slug} href={"/brand/" + b.slug}>
            <h2>{b.title}</h2>
            <span className="brand-tile-bottom">
              {products.filter(b.match).length} fragrances{" "}
              <ArrowUpRight size={22} />
            </span>
          </Link>
        ))}
      </div>
      {!shown.length && (
        <div className="empty">
          <h2>
            {brands.length ? "No matching brand." : "Brands are being curated."}
          </h2>
          <p>
            {brands.length
              ? "Try another name or clear your search."
              : "Browse the available fragrance collection."}
          </p>
          {brands.length ? (
            <button className="text-link" onClick={() => setQuery("")}>
              Clear search
            </button>
          ) : (
            <Link href="/shop">Shop perfumes</Link>
          )}
        </div>
      )}
    </section>
  );
}
