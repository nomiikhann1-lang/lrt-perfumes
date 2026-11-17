"use client";
import { useEffect, useRef, useState } from "react";
import Link from "./StoreLink";
import {
  Menu,
  Search,
  ShoppingBag,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import NavSearch from "./NavSearch";
import Bottle from "./ProductBottle";
import { MarketPicker } from "./MobileEnhancements";
import { collectionsFor } from "../lib/collections";
export const primaryNavigation = [
  ["Shop", "/shop"],
  ["Brand", "/brand"],
  ["Collection", "/collection"],
  ["Our story", "/about"],
  ["Contact", "/contact"],
];
export default function StoreHeader({
  products,
  country,
  onMarket,
  onSearch,
  onBag,
  onMenu,
  count,
}) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [open, setOpen] = useState(false),
    ref = useRef(null),
    trigger = useRef(null);
  useEffect(() => {
    const outside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
        setAboutOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const collections = collectionsFor(products).filter(
    (c) => c.group !== "Brands",
  );
  return (
    <header
      className="store-header"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && (open || aboutOpen)) {
          setOpen(false);
          setAboutOpen(false);
          if (aboutOpen) ref.current?.querySelector(".about-trigger")?.focus();
          else trigger.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
          setAboutOpen(false);
        }
      }}
    >
      <Link className="brand" href="/" aria-label="LRT Perfumes homepage">
        <img src="/logo.png" alt="" width="40" height="40" />
        <span>
          LRT<small>PERFUMES</small>
        </span>
      </Link>
      <nav className="primary-navigation" aria-label="Main navigation">
        <button
          ref={trigger}
          aria-expanded={open}
          aria-controls="perfume-navigation"
          onClick={() => {
            setAboutOpen(false);
            setOpen((v) => !v);
          }}
        >
          Perfumes <ChevronDown size={13} />
        </button>
        {primaryNavigation.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <NavSearch products={products} country={country} />

      <div className="nav-actions">
        <div className="about-navigation">
          <button
            className="about-trigger"
            aria-expanded={aboutOpen}
            aria-controls="about-dropdown"
            onClick={() => {
              setOpen(false);
              setAboutOpen((v) => !v);
            }}
          >
            About <ChevronDown size={13} />
          </button>
          {aboutOpen && (
            <nav id="about-dropdown" aria-label="About LRT">
              {[
                ["About LRT", "/about"],
                ["Our stores", "/stores"],
                ["Contact", "/contact"],
                ["Questions & answers", "/faq"],
                ["Delivery", "/shipping"],
                ["Returns", "/returns"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setAboutOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <MarketPicker country={country} onChange={onMarket} />
        <button
          className="icon bag-icon"
          aria-label={`Shopping bag, ${count} items`}
          onClick={onBag}
        >
          <ShoppingBag size={20} />
          <span>{count}</span>
        </button>
        <button
          className="icon mobile-menu"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu />
        </button>
      </div>
      {open && (
        <nav
          id="perfume-navigation"
          className="perfume-navigation"
          aria-label="Explore perfumes"
        >
          <div className="perfume-menu-visuals">
            {[
              {
                title: "Shop all perfumes",
                href: "/shop",
                product: products[0],
              },
              ...collections
                .filter(
                  (c) =>
                    c.group === "Collections" || c.group === "Scent families",
                )
                .slice(0, 2)
                .map((c) => ({
                  title: c.title,
                  href: "/collection/" + c.slug,
                  product: products.find(c.match),
                })),
            ]
              .filter((c) => c.product)
              .map((c, i) => (
                <Link
                  className="perfume-menu-card"
                  key={c.href}
                  href={c.href}
                  onClick={() => setOpen(false)}
                >
                  <div className={"perfume-menu-art tone-" + i}>
                    <Bottle product={c.product} />
                  </div>
                  <span>
                    {c.title}
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              ))}
          </div>
          <div className="perfume-menu-links">
            <h2>Shop by gender</h2>
            {collections
              .filter((c) => c.group === "Shop by gender")
              .map((c) => (
                <Link
                  key={c.slug}
                  href={"/collection/" + c.slug}
                  onClick={() => setOpen(false)}
                >
                  {c.title}
                </Link>
              ))}
          </div>
          <div className="perfume-menu-links">
            <h2>The edits</h2>
            {collections
              .filter((c) => c.group === "Discover" && c.slug !== "all")
              .map((c) => (
                <Link
                  key={c.slug}
                  href={"/collection/" + c.slug}
                  onClick={() => setOpen(false)}
                >
                  {c.title}
                </Link>
              ))}
            <Link href="/shop?family=Favorites" onClick={() => setOpen(false)}>
              Your favorites
            </Link>
            <Link href="/brand" onClick={() => setOpen(false)}>
              Explore brands
            </Link>
          </div>
          <div className="perfume-menu-links">
            <h2>Discover your scent</h2>
            <Link href="/fragrance-guide" onClick={() => setOpen(false)}>
              Fragrance guide
            </Link>
            <details>
              <summary>
                Scent families <ChevronDown size={14} />
              </summary>
              {collections
                .filter((c) => c.group === "Scent families")
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={"/collection/" + c.slug}
                    onClick={() => setOpen(false)}
                  >
                    {c.title}
                  </Link>
                ))}
            </details>
            <Link href="/collection" onClick={() => setOpen(false)}>
              All collections
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
