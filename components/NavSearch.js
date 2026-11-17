"use client";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "./StoreLink";
import Bottle from "./ProductBottle";
import { searchProducts, priceFor, productSizes } from "../lib/catalog";
import { markets, scentFamily } from "../lib/store-config";

export default function NavSearch({ products, country }) {
  const root = useRef(null),
    router = useRouter(),
    [query, setQuery] = useState(""),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(-1);
  const visible = open && Boolean(query.trim());
  const matches = visible ? searchProducts(products, query).slice(0, 6) : [];
  const currency = markets[country].currency;
  useEffect(() => {
    if (!open) return;
    const outside = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  function navigate(e) {
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!matches.length || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const index =
      e.key === "ArrowDown"
        ? (active + 1) % matches.length
        : active <= 0
          ? matches.length - 1
          : active - 1;
    setActive(index);
    root.current
      .querySelector("#nav-match-" + index)
      ?.scrollIntoView({ block: "nearest" });
  }
  return (
    <form
      ref={root}
      className="nav-search-pill"
      action="/shop"
      role="search"
      onBlur={(e) => {
        if (!root.current.contains(e.relatedTarget)) setOpen(false);
      }}
      onSubmit={(e) => {
        if (matches[active]) {
          e.preventDefault();
          setOpen(false);
          router.push("/product/" + matches[active].slug);
        }
      }}
    >
      <input
        type="search"
        name="q"
        value={query}
        placeholder="Search"
        aria-label="Search"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="nav-matches"
        aria-expanded={visible}
        aria-activedescendant={
          matches[active] ? "nav-match-" + active : undefined
        }
        autoComplete="off"
        maxLength={160}
        onKeyDown={navigate}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setOpen(true);
          setActive(-1);
          setQuery(e.target.value);
        }}
      />
      <button aria-label="Submit search">
        <Search size={17} />
      </button>
      <div className="nav-results" hidden={!visible}>
        <ul id="nav-matches" role="listbox" aria-label="Matching perfumes">
          {matches.map((p, i) => {
            const price = priceFor(p, productSizes(p)[0], currency),
              family = scentFamily(p);
            return (
              <li key={p.id} role="presentation">
                <Link
                  role="option"
                  aria-selected={active === i}
                  id={"nav-match-" + i}
                  tabIndex={-1}
                  href={"/product/" + p.slug}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-thumb">
                    {p.image ? (
                      <img src={p.image} alt="" />
                    ) : (
                      <Bottle product={p} small />
                    )}
                  </span>
                  <span>
                    <strong>{p.name}</strong>
                    {family && (
                      <small>
                        <img
                          src={
                            "/scent-families/" + family.toLowerCase() + ".png"
                          }
                          width="16"
                          height="16"
                          alt=""
                        />
                        {family}
                      </small>
                    )}
                  </span>
                  <span>
                    {price === null
                      ? "Unavailable"
                      : currency + " " + price.toLocaleString("en")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {matches.length ? (
          <Link
            className="nav-all"
            href={"/shop?q=" + encodeURIComponent(query)}
          >
            View all results ↗
          </Link>
        ) : (
          <p role="status">No perfumes match “{query}”.</p>
        )}
      </div>
    </form>
  );
}
