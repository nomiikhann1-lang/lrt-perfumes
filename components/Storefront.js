"use client";
import Link from "./StoreLink";
import { StoreLanding, StoreDirectory } from "./StoreVisits";
import OurStory from "./OurStory";
import { shopPromotions, promotionSlots } from "../lib/shop-promotions";
import ShopPromotion from "./ShopPromotion";
import StoreHeader, { primaryNavigation } from "./StoreHeader";
import BrandDirectory from "./BrandDirectory";
import CollectionHero, { RelatedCollections } from "./CollectionHero";
import {
  PAGE_SIZE,
  filterCatalogue,
  sameBrandProducts,
  addToBag,
} from "../lib/storefront-data";
import ProductGallery from "./ProductGallery";
import Bottle from "./ProductBottle";
import Footer from "./Footer";
import EditorialMedia from "./EditorialMedia";
import {
  collectionsFor,
  collectionHref,
  taxonomyHref,
  productBrand,
  productCollection,
} from "../lib/collections";
import { newRequestId } from "../lib/request-id";
import { useRouter } from "next/navigation";
import { mobilePageContent } from "../lib/mobile-pages";
import {
  mobileHero,
  markets,
  familyColors,
  scentFamilies,
  scentFamily,
} from "../lib/store-config";
import { MarketPicker, MobileHero, ScentIcon } from "./MobileEnhancements";
import { pageContent } from "../lib/pages";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  X,
  Plus,
  Minus,
  Check,
  ChevronDown,
  Menu,
  Heart,
  Truck,
  ShieldCheck,
  SlidersHorizontal,
  ArrowLeft,
  Sliders,
  ChevronRight,
  CreditCard,
  Banknote,
  LockKeyhole,
  Sparkles,
  Sun,
  Moon,
  Gift,
  Droplets,
  Compass,
  Flower2,
} from "lucide-react";
import {
  cities,
  priceFor,
  searchProducts,
  stockFor,
  productSizes,
} from "../lib/catalog";
function Modal({ children, onClose, label, wide = false, drawer = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    node
      ?.querySelector("input,button,select,a")
      ?.focus({ preventScroll: true });
    function key(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = [
          ...node.querySelectorAll("button,input,select,a[href],textarea"),
        ].filter((x) => !x.disabled && x.getClientRects().length);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === f.at(-1)) {
          e.preventDefault();
          f[0].focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <div
      className={"overlay " + (drawer ? "drawer-overlay" : "")}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={"modal " + (wide ? "wide" : "")}
      >
        <button
          className="close icon"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X />
        </button>
        {children}
      </section>
    </div>
  );
}
export default function Storefront({
  commerceEnabled = false,
  initialProducts = [],
  promotionSeed = 0,
  storeSlug = "",
  initialMode = "demo",
  initialError = "",
  view = "home",
  productSlug = "",
  initialQuery = "",
  initialFamily = "All",
  initialGender = "All",
  collectionSlug = "",
  collectionTitle = "",
  collectionDescription = "",
}) {
  const router = useRouter();
  const [mobile, setMobile] = useState(false);
  const latestRef = useRef(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:760px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const content = pageContent[view] || mobilePageContent[view];
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [view, productSlug, initialQuery, initialFamily, initialGender]);
  const [products, setProducts] = useState(initialProducts),
    [mode, setMode] = useState(initialMode),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(initialError),
    [panel, setPanel] = useState(view === "cart" ? "bag" : null),
    [size, setSize] = useState(
      () =>
        productSizes(
          initialProducts.find((p) => p.slug === productSlug) || {},
        )[0] || 50,
    ),
    [bag, setBag] = useState([]),
    [saved, setFavorites] = useState([]),
    [country, setCountry] = useState("QA"),
    [query, setQuery] = useState(initialQuery),
    [family, setFamily] = useState(initialFamily),
    [families, setFamilies] = useState(
      initialFamily === "All"
        ? []
        : [initialFamily === "Saved" ? "Favorites" : initialFamily],
    ),
    [genders, setGenders] = useState(
      initialGender === "All" ? [] : [initialGender],
    ),
    [gender, setGender] = useState(initialGender),
    [sort, setSort] = useState("featured"),
    [toast, setToast] = useState(""),
    [cartNotice, setCartNotice] = useState(false),
    [ready, setReady] = useState(false),
    [info, setInfo] = useState(""),
    [receipt, setReceipt] = useState(null),
    [busy, setBusy] = useState(false),
    [checkError, setCheckError] = useState(""),
    [payment, setPayment] = useState("cod"),
    [quiz, setQuiz] = useState("Fresh"),
    [activeResult, setActiveResult] = useState(-1),
    [recent, setRecent] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [brands, setBrands] = useState([]),
    [visibleCount, setVisibleCount] = useState(PAGE_SIZE),
    [quantity, setQuantity] = useState(1);
  const moreRef = useRef(null);
  useEffect(
    () => setVisibleCount(PAGE_SIZE),
    [query, families, genders, brands, sort, country, collectionSlug],
  );
  const selected = products.find((p) => p.slug === productSlug) || null;
  const submitting = useRef(false);
  const requestId = useRef(null),
    searchInput = useRef(null);
  const load = () => {
    setLoading(true);
    setError("");
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw Error(d.error);
        setProducts(d.products);
        setMode(d.mode);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    try {
      for (const key of ["bag", "saved", "recent"]) {
        const old = localStorage.getItem(["no", "or"].join("") + "-" + key);
        if (old && !localStorage.getItem("lrt-" + key))
          localStorage.setItem("lrt-" + key, old);
      }
      const storedMarket = localStorage.getItem("lrt-market");
      if (markets[storedMarket]) setCountry(storedMarket);
      else
        fetch("/api/market")
          .then((r) => r.json())
          .then((d) => {
            if (!localStorage.getItem("lrt-market-chosen"))
              setCountry(d.country === "AE" ? "AE" : "QA");
          })
          .catch(() => {});
      const b = JSON.parse(localStorage.getItem("lrt-bag") || "[]");
      if (Array.isArray(b))
        setBag(
          b.filter(
            (x) =>
              Number.isInteger(x.id) &&
              Number.isInteger(x.qty) &&
              x.qty > 0 &&
              x.qty <= 10 &&
              Number.isInteger(x.size),
          ),
        );
      const s = JSON.parse(localStorage.getItem("lrt-saved") || "[]");
      if (Array.isArray(s)) setFavorites(s);
      const r = JSON.parse(localStorage.getItem("lrt-recent") || "[]");
      if (Array.isArray(r))
        setRecent(r.filter((x) => typeof x === "string").slice(0, 4));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("lrt-bag", JSON.stringify(bag));
        localStorage.setItem("lrt-saved", JSON.stringify(saved));
        localStorage.setItem("lrt-market", country);
      } catch {}
    }
  }, [bag, saved, ready, country]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 7000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    requestId.current = null;
  }, [bag, country, payment]);
  function chooseMarket(code) {
    setCountry(code);
    try {
      localStorage.setItem("lrt-market-chosen", "1");
    } catch {}
    document.cookie = `lrt_market=${code}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  const currency = markets[country].currency,
    market = markets[country];
  const lines = bag
      .map((i) => ({ ...i, p: products.find((p) => p.id === i.id) }))
      .filter((i) => i.p),
    subtotal = lines.reduce(
      (n, i) => n + (priceFor(i.p, i.size, currency) ?? 0) * i.qty,
      0,
    ),
    shipping = subtotal >= market.freeAt ? 0 : market.shipping,
    count = bag.reduce((n, i) => n + i.qty, 0);
  const unavailable =
    lines.length !== bag.length ||
    lines.some(
      (i) =>
        priceFor(i.p, i.size, currency) === null ||
        i.qty > stockFor(i.p, i.size),
    );
  const catalogueCollections = collectionsFor(products);
  const representedFamilies = new Set(products.map(scentFamily));
  const availableFamilies = scentFamilies.filter((name) =>
    representedFamilies.has(name),
  );
  const activeCollection = catalogueCollections.find(
    (c) => c.slug === collectionSlug,
  );
  const results = searchProducts(products, query);
  const shown = filterCatalogue(
    activeCollection ? products.filter(activeCollection.match) : products,
    { query, families, genders, brands, favorites: saved, sort, currency },
  );
  const campaigns = shopPromotions.filter(
    (promo) =>
      !promo.href.startsWith("/collection/") ||
      catalogueCollections.some((c) => "/collection/" + c.slug === promo.href),
  );
  const promos =
    view === "shop" &&
    !activeCollection &&
    !query.trim() &&
    !families.length &&
    !genders.length &&
    !brands.length
      ? promotionSlots(shown.length, campaigns, promotionSeed)
      : new Map();
  useEffect(() => {
    if (view !== "shop" || visibleCount >= shown.length || !moreRef.current)
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting))
          setVisibleCount((n) => Math.min(n + PAGE_SIZE, shown.length));
      },
      { rootMargin: "180px" },
    );
    observer.observe(moreRef.current);
    return () => observer.disconnect();
  }, [view, visibleCount, shown.length]);
  const close = () => {
    setPanel(null);
    setCheckError("");
    if (view === "cart") router.push("/shop");
  };
  function notify(s) {
    setCartNotice(false);
    setToast(s);
  }
  function add(p, s = productSizes(p)[0], showBag = true, qty = 1) {
    try {
      const next = addToBag(bag, p, s, qty, currency);
      setBag(next);
      notify(`${p.name} added to your bag`);
      setCartNotice(true);
    } catch (e) {
      notify(e.message);
    }
  }
  function openProduct(p) {
    router.push("/product/" + p.slug);
  }
  function shop(f = "All", g = "All") {
    router.push(collectionHref(f, g));
    setFamily(f);
    setFamilies(f === "All" ? [] : [f]);
    setGender(g);
    setGenders(g === "All" ? [] : [g]);
    setQuery("");
    setPanel(null);
  }
  function remember(q) {
    if (!q.trim()) return;
    const next = [q, ...recent.filter((x) => x !== q)].slice(0, 4);
    setRecent(next);
    try {
      localStorage.setItem("lrt-recent", JSON.stringify(next));
    } catch {}
  }
  function viewResults() {
    remember(query);
    close();
    router.push("/shop?q=" + encodeURIComponent(query));
  }
  function changeQty(line, delta) {
    if (delta > 0) {
      add(line.p, line.size, false);
      return;
    }
    setBag((b) =>
      b
        .map((i) =>
          i.id === line.id && i.size === line.size
            ? { ...i, qty: i.qty - 1 }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  }
  async function checkout(e) {
    e.preventDefault();
    if (submitting.current) return;
    if (mode === "wordpress" && !commerceEnabled) {
      setCheckError(
        "Online ordering is not yet available. Please contact our team.",
      );
      return;
    }
    if (unavailable) {
      setCheckError("Please remove unavailable sizes before checkout.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setCheckError("");
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const payload = { ...data, country, currency, payment, items: bag };
      const bytes = new TextEncoder().encode(JSON.stringify(payload));
      const fingerprint = globalThis.crypto?.subtle
        ? Array.from(
            new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
            (b) => b.toString(16).padStart(2, "0"),
          ).join("")
        : null;
      let pending;
      try {
        pending = JSON.parse(
          sessionStorage.getItem("lrt-pending-order") || "null",
        );
      } catch {}
      requestId.current ||=
        fingerprint && pending?.fingerprint === fingerprint
          ? pending.id
          : newRequestId();
      if (fingerprint)
        try {
          sessionStorage.setItem(
            "lrt-pending-order",
            JSON.stringify({ fingerprint, id: requestId.current }),
          );
        } catch {}
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          country,
          currency,
          payment,
          items: bag,
          requestId: requestId.current,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw Error(d.error);
      if (d.paymentUrl) {
        window.location.assign(d.paymentUrl);
        return;
      }
      if (
        d.mode === "wordpress" &&
        payment === "card" &&
        !["processing", "completed"].includes(d.status)
      )
        throw Error(
          "Payment is not confirmed. Contact support with your order reference " +
            d.id +
            ".",
        );
      try {
        sessionStorage.removeItem("lrt-pending-order");
      } catch {}
      setReceipt(d);
      setBag([]);
      setPanel("receipt");
    } catch (e) {
      setCheckError(e.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  const money = (n, c = currency) =>
    n === null
      ? "Not available"
      : `${c} ${Number(n).toLocaleString("en", { maximumFractionDigits: 2 })}`;
  function Card({ p }) {
    const firstSize = productSizes(p)[0];
    return (
      <article
        className="product-card"
        style={{ "--family-tone": familyColors[scentFamily(p)] || p.color }}
      >
        <div
          className="product-art"
          style={{
            "--card-color": familyColors[scentFamily(p)],
          }}
        >
          <button
            className="art-link"
            onClick={() => openProduct(p)}
            aria-label={`View ${p.name}`}
          >
            <Bottle product={p} />
          </button>
          {p.tag && <span className="badge">{p.tag}</span>}
          <button
            className={"heart icon " + (saved.includes(p.id) ? "hearted" : "")}
            aria-label={`${saved.includes(p.id) ? "Remove from favorites:" : "Add to favorites:"} ${p.name}`}
            onClick={() =>
              setFavorites((s) =>
                s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id],
              )
            }
          >
            <Heart size={18} />
          </button>
          <button
            className="quick-add"
            onClick={() => add(p)}
            disabled={
              !p.stock ||
              priceFor(p, firstSize, currency) === null ||
              !stockFor(p, firstSize)
            }
          >
            {!p.stock
              ? "Sold out"
              : priceFor(p, firstSize, currency) === null
                ? "Not available"
                : `Add to bag — ${firstSize} ml`}
            <Plus size={16} />
          </button>
        </div>
        <div className="mobile-scent-badge" data-family={scentFamily(p)}>
          <ScentIcon family={scentFamily(p)} />
          {scentFamily(p)}
        </div>
        <div className="product-meta">
          <span>{p.gender}</span>
          <span>{firstSize} ml</span>
        </div>
        <Link className="product-name" href={"/product/" + p.slug}>
          {query.trim() && view === "shop" && (
            <ScentIcon family={scentFamily(p)} />
          )}{" "}
          {p.name}
        </Link>
        <p className="notes">{p.notes.join(" · ")}</p>
        <div className="price-row">
          <span>{money(priceFor(p, firstSize, currency))}</span>
          <button
            onClick={() => openProduct(p)}
            aria-label={`Discover ${p.name}`}
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
        <button
          className="list-add"
          onClick={() => add(p)}
          disabled={
            !stockFor(p, firstSize) || priceFor(p, firstSize, currency) === null
          }
        >
          {!stockFor(p, firstSize)
            ? "Sold out"
            : priceFor(p, firstSize, currency) === null
              ? "Not available"
              : "Add to cart"}
        </button>
      </article>
    );
  }
  return (
    <>
      <div className="announcement">
        LUXURY IN EVERY SCENT · Explore the LRT fragrance world{" "}
        <ArrowRight size={13} />
      </div>
      <StoreHeader
        products={products}
        country={country}
        onMarket={chooseMarket}
        onSearch={() => setPanel("search")}
        onBag={() => setPanel("bag")}
        onMenu={() => setPanel("menu")}
        count={count}
      />

      <main id="main-content">
        {error && view !== "shop" && (
          <section className="content-page" role="alert">
            <h2>The collection is temporarily unavailable.</h2>
            <p>{error}</p>
            <button className="primary" disabled={loading} onClick={load}>
              Try again
            </button>
          </section>
        )}
        {view === "privacy" && (
          <button
            className="privacy-preferences"
            onClick={() => window.dispatchEvent(new Event("lrt:open-consent"))}
          >
            Manage cookie preferences
          </button>
        )}
        {view === "collections" && (
          <section className="collection-directory">
            <div className="directory-heading">
              <Compass size={32} />
              <span className="eyebrow">THE LRT FRAGRANCE LIBRARY</span>
              <h1>
                A world of <em>possibility.</em>
              </h1>
              <p>Follow a note, a mood, or a name you love.</p>
            </div>
            {[
              "Discover",
              "Shop by gender",
              "Scent families",
              "Collections",
            ].map((group) => (
              <section className="directory-group" key={group}>
                <h2>{group}</h2>
                <div>
                  {collectionsFor(products)
                    .filter((c) => c.group === group)
                    .map((c) => (
                      <Link href={"/collection/" + c.slug} key={c.slug}>
                        <ScentIcon
                          family={c.title.replace(" perfumes", "")}
                          size={28}
                        />
                        <h3>{c.title}</h3>
                        <span>
                          {products.filter(c.match).length} fragrances{" "}
                          <ArrowUpRight size={18} />
                        </span>
                      </Link>
                    ))}
                </div>
              </section>
            ))}
          </section>
        )}
        {view === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="tiny-line" /> THE LRT SCENT WARDROBE / 01
                </span>
                <h1>
                  Good scents. <br />
                  Great <em>feelings.</em>
                </h1>
                <p>
                  A world of inspired fragrance.
                  <br />
                  Find the notes that make you, you.
                </p>
                <button className="primary" onClick={() => shop()}>
                  Discover your signature <ArrowUpRight size={18} />
                </button>
                <div className="hero-bottom">
                  <span>EXPRESSIVE SCENTS. EVERYDAY LUXURY.</span>
                  <span>01 — 10</span>
                </div>
              </div>
              <div className="hero-visual">
                <MobileHero />
                <div className="sunlight" />
                <div className="hero-orbit" />
                <div className="hero-bottle">
                  {products[0] && <Bottle product={products[0]} />}
                </div>
                <span className="vertical-note">
                  A NEW WAY TO WEAR YOURSELF
                </span>
                <div className="hero-feature">
                  <div>
                    <small>MEET YOUR NEXT SIGNATURE</small>
                    <span>Saffron Veil</span>
                    <p>Saffron. Jasmine. A little intrigue.</p>
                  </div>
                  <button
                    className="round"
                    onClick={() => products[0] && openProduct(products[0])}
                    aria-label="Explore Saffron Veil"
                  >
                    <ArrowUpRight />
                  </button>
                </div>
              </div>
            </section>
            <div className="promise-strip">
              <span>
                <Truck size={17} /> UAE & Qatar delivery
              </span>
              <span>
                <ShieldCheck size={17} /> Secure checkout when connected
              </span>
              <span>
                <span className="spark">✧</span> Your scent. Your expression.
              </span>
              <span className="demo-marker">
                {mode === "demo"
                  ? "DEMO BOUTIQUE · NO REAL PAYMENTS"
                  : "CONNECTED TO WOOCOMMERCE"}
              </span>
            </div>
            <section className="latest-drops">
              <div className="drops-heading">
                <div>
                  <span className="eyebrow">SOMETHING NEW TO LOVE</span>
                  <h2>Our latest drops.</h2>
                </div>
                <Link href="/collection/new-arrivals">
                  View all <ArrowUpRight size={15} />
                </Link>
              </div>
              <div
                className="drops-track"
                ref={latestRef}
                aria-label="Latest fragrances"
              >
                {products
                  .filter((p) => p.tag === "New")
                  .concat(products.filter((p) => p.tag !== "New"))
                  .slice(0, 6)
                  .map((p) => (
                    <Card key={p.id} p={p} />
                  ))}
              </div>
              <div className="carousel-controls">
                <span>Swipe to discover</span>
                <button
                  aria-label="Previous fragrances"
                  onClick={() =>
                    latestRef.current?.scrollBy({
                      left: -270,
                      behavior: "smooth",
                    })
                  }
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  aria-label="Next fragrances"
                  onClick={() =>
                    latestRef.current?.scrollBy({
                      left: 270,
                      behavior: "smooth",
                    })
                  }
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          </>
        )}
        {view === "brands" && <BrandDirectory products={products} />}
        {view === "shop" && (
          <section className="collection" id="collection">
            {activeCollection ? (
              <CollectionHero
                collection={activeCollection}
                products={products}
              />
            ) : (
              <div className="section-head">
                <div>
                  <span className="eyebrow">THE SCENT WARDROBE</span>
                  <h1>
                    Find your kind of <em>extraordinary.</em>
                  </h1>
                </div>
              </div>
            )}
            <div className="shop-discovery-search">
              <label className="shop-search">
                <span className="search-caption">Search the collection</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search scents or ingredients"
                  aria-label="Search shop"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
                <Search className="search-submit-icon" size={20} />
              </label>
              <div className="popular-shop">
                <strong>POPULAR SEARCHES</strong>
                <div>
                  {[
                    "Vanilla",
                    "Oud",
                    "Rose",
                    "Saffron",
                    "Bergamot",
                    "Musk",
                  ].map((n) => (
                    <button key={n} onClick={() => setQuery(n)}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="global-filter-bar">
              <button onClick={() => setPanel("filters")}>
                <Sliders size={17} /> Filter{" "}
                {families.length + genders.length + brands.length > 0 && (
                  <b>{families.length + genders.length + brands.length}</b>
                )}
              </button>
              <button onClick={() => setPanel("gender-filter")}>
                <Heart size={16} /> Gender{" "}
                {genders.length > 0 && `(${genders.length})`}
                <ChevronDown size={14} />
              </button>
              <button onClick={() => setPanel("family-filter")}>
                <ScentIcon family="Floral" /> Scent family{" "}
                {families.length > 0 && `(${families.length})`}
                <ChevronDown size={14} />
              </button>
              <button onClick={() => setPanel("brand-filter")}>
                Brand {brands.length > 0 && `(${brands.length})`}{" "}
                <ChevronDown size={14} />
              </button>
              <label className="sort-select">
                Sort by{" "}
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {[
                    ["featured", "Featured"],
                    ["best", "Bestsellers"],
                    ["newest", "Newest"],
                    ["low", "Price: low to high"],
                    ["high", "Price: high to low"],
                    ["name", "Name: A–Z"],
                  ].map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <button
                aria-pressed={families.includes("Favorites")}
                onClick={() =>
                  setFamilies((f) =>
                    f.includes("Favorites")
                      ? f.filter((x) => x !== "Favorites")
                      : [...f, "Favorites"],
                  )
                }
              >
                Favorites ({saved.length})
              </button>
            </div>
            <div className="results-line">
              <span>
                {loading
                  ? "Opening the collection…"
                  : `${shown.length} fragrances`}
                {gender !== "All" && ` · ${gender}`}
                {query && ` · “${query}”`}
              </span>
              {Boolean(
                query || genders.length || families.length || brands.length,
              ) && (
                <button
                  onClick={() => {
                    setFamily("All");
                    setGender("All");
                    setFamilies([]);
                    setGenders([]);
                    setBrands([]);
                    setQuery("");
                  }}
                >
                  Clear filters <X size={13} />
                </button>
              )}
              <span>Prices in {currency}</span>
            </div>
            {error ? (
              <div className="empty">
                <h3>We couldn’t open the collection.</h3>
                <p>{error}</p>
                <button className="primary" onClick={load}>
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="product-grid">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="skeleton" />
                ))}
              </div>
            ) : shown.length ? (
              <div className="product-grid">
                {shown.slice(0, visibleCount).map((p, index) => (
                  <Fragment key={p.id}>
                    {promos.has(index) && (
                      <ShopPromotion promo={promos.get(index)} />
                    )}
                    <Card p={p} />
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="empty">
                <h3>No scents found, yet.</h3>
                <p>Try “vanilla”, “oud” or a different scent family.</p>
                <button className="primary" onClick={() => shop()}>
                  Explore all fragrances
                </button>
              </div>
            )}
            {visibleCount < shown.length && (
              <div ref={moreRef} className="load-more">
                <p aria-live="polite">
                  Showing {Math.min(visibleCount, shown.length)} of{" "}
                  {shown.length} fragrances
                </p>
                <button
                  className="secondary"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  Show next 40
                </button>
              </div>
            )}
            {activeCollection && activeCollection.group !== "Brands" && (
              <RelatedCollections
                collections={collectionsFor(products)}
                current={activeCollection}
              />
            )}
          </section>
        )}
        {view === "home" && (
          <>
            <EditorialMedia />
            <section className="family-discovery">
              <span className="eyebrow">FOLLOW YOUR NOTES</span>
              <h2>Find your fragrance family.</h2>
              <div>
                {availableFamilies.map((f) => (
                  <Link key={f} href={collectionHref(f)}>
                    <ScentIcon family={f} size={28} />
                    <strong>{f}</strong>
                    <span>
                      Explore fragrances <ArrowUpRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <section className="colour-stories">
              <span className="eyebrow">A SCENT FOR EVERY SIDE OF YOU</span>
              <h2>
                What colour is your <em>mood?</em>
              </h2>
              <div>
                {[
                  ["Fresh", "A fresh start."],
                  ["Floral", "In full bloom."],
                  ["Woody", "After dark."],
                ]
                  .filter(([f]) => representedFamilies.has(f))
                  .map(([f, t]) => (
                    <Link
                      key={f}
                      href={collectionHref(f)}
                      className={"story-" + f}
                      style={{ backgroundColor: familyColors[f] }}
                    >
                      <span>{f.toUpperCase()}</span>
                      <h3>{t}</h3>
                      <span>Explore the edit ↗</span>
                    </Link>
                  ))}
              </div>
            </section>
            <section className="editorial">
              <div
                className="editorial-photo"
                role="img"
                aria-label="Minimal botanical skincare still life"
              />
              <div className="editorial-copy">
                <span className="eyebrow">MORE THAN WHAT YOU WEAR</span>
                <h2>
                  Some things
                  <br />
                  are better <em>felt.</em>
                </h2>
                <p>
                  The first spray. The familiar warmth. The way a scent stays
                  long after a moment has passed.
                </p>
                <p>
                  {mobile
                    ? "From our beginnings in Qatar in 2020 to a growing collection of oil-based signature and inspired fragrances, every blend is made to feel personal."
                    : "LRT Perfumes brings inspired fragrance to Qatar and the UAE. Discover a personal scent, explore a new direction, or visit us to talk about a custom perfume."}
                </p>
                <button
                  className="text-link"
                  onClick={() => router.push("/about")}
                >
                  Step into our world <ArrowUpRight size={18} />
                </button>
              </div>
            </section>
            <EditorialMedia video />
            <section className="home-guide">
              <div>
                <span className="eyebrow">ONE SIGNATURE. THREE SIZES.</span>
                <h2>Made for your everyday.</h2>
                <p>
                  Choose 50 ml for your bag, 100 ml for your dressing table or
                  200 ml for the scent you always come back to.
                </p>
                <Link className="text-link" href="/shop">
                  Explore the collection <ArrowUpRight size={16} />
                </Link>
              </div>
              <div>
                <span className="eyebrow">COME SAY HELLO</span>
                <h2>A personal touch.</h2>
                <p>
                  Visit LRT in Doha, Al Wakrah, Al Khor or Dubai. Discover a
                  favourite or speak to our team about a custom blend.
                </p>
                <Link className="text-link" href="/contact">
                  Find your nearest store <ArrowUpRight size={16} />
                </Link>
              </div>
            </section>
            <section className="occasion-edit">
              <div>
                <span className="eyebrow">EVERY DAY, A DIFFERENT YOU</span>
                <h2>
                  Dress for the <em>moment.</em>
                </h2>
              </div>
              <div className="occasion-grid">
                {[
                  [
                    Sun,
                    "The everyday escape",
                    "Fresh, bright notes for a lighter start.",
                    "fresh",
                  ],
                  [
                    Moon,
                    "After the sun sets",
                    "Warm notes and woods for evening moments.",
                    "warm",
                  ],
                  [
                    Gift,
                    "A thoughtful discovery",
                    "Find a scent to make their everyday special.",
                    "all",
                  ],
                ].map(([Icon, title, text, slug]) => (
                  <Link key={slug} href={"/collection/" + slug}>
                    <Icon size={33} />
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <span>
                      Explore the edit <ArrowUpRight size={18} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <section className="scent-ritual">
              <div>
                <Droplets size={36} />
                <span className="eyebrow">THE SMALL RITUALS</span>
                <h2>
                  Make your signature
                  <br />
                  <em>your own.</em>
                </h2>
                <p>
                  Start with the notes you love. Try a little on your skin, let
                  it settle, and discover how the fragrance changes through the
                  day.
                </p>
                <Link className="text-link" href="/fragrance-guide">
                  Explore the fragrance guide <ArrowUpRight size={18} />
                </Link>
              </div>
              <div className="ritual-steps">
                {[
                  [
                    Compass,
                    "01",
                    "Follow your notes",
                    "Explore six scent families and find your starting point.",
                  ],
                  [
                    Droplets,
                    "02",
                    "Give it a moment",
                    "Let the opening settle before discovering the heart and base.",
                  ],
                  [
                    Sparkles,
                    "03",
                    "Build a scent wardrobe",
                    "Choose different fragrances for the moments that matter to you.",
                  ],
                ].map(([Icon, n, t, d]) => (
                  <article key={n}>
                    <Icon size={24} />
                    <div>
                      <small>{n}</small>
                      <h3>{t}</h3>
                      <p>{d}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="scent-invite">
              <span className="eyebrow">FOLLOW YOUR FEELING</span>
              <h2>
                Your next favourite is
                <br />
                one discovery <em>away.</em>
              </h2>
              <button className="primary" onClick={() => setPanel("search")}>
                Find your scent <Search size={17} />
              </button>
              <div className="note-pills">
                {["Vanilla", "Oud", "Bergamot", "Rose", "Musk"].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setQuery(n);
                      setPanel("search");
                    }}
                  >
                    {n}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
        {view === "product" && selected && (
          <section className="pdp">
            <div className="breadcrumbs">
              <Link href="/">Home</Link> / <Link href="/shop">Perfumes</Link> /{" "}
              {selected.name}
            </div>
            <div className="product-detail">
              <div
                className="detail-art"
                style={{
                  background: familyColors[scentFamily(selected)],
                }}
              >
                <ProductGallery
                  product={selected}
                  size={size}
                  fallback={<Bottle product={selected} volume={size} />}
                />
                {scentFamily(selected) && (
                  <Link
                    className="art-family-link"
                    href={collectionHref(scentFamily(selected))}
                  >
                    <ScentIcon family={scentFamily(selected)} />
                    {scentFamily(selected)} <ArrowUpRight size={15} />
                  </Link>
                )}
              </div>
              <div className="detail-copy">
                <span className="eyebrow">
                  LRT ·{" "}
                  {mode === "demo"
                    ? "THE SAMPLE COLLECTION"
                    : "YOUR SIGNATURE SCENT"}
                </span>
                <h1>{selected.name}</h1>
                <p>{selected.description}</p>
                <div className="note-breakdown">
                  {["Top", "Heart", "Base"].map((n, i) =>
                    selected.notes[i] ? (
                      <div key={n}>
                        <small>{n} note</small>
                        <span>{selected.notes[i]}</span>
                      </div>
                    ) : null,
                  )}
                </div>
                <div className="product-taxonomy">
                  <div>
                    <small>Brand</small>
                    <Link
                      href={taxonomyHref(
                        products,
                        "Brands",
                        productBrand(selected),
                      )}
                    >
                      {productBrand(selected)} <ArrowUpRight size={13} />
                    </Link>
                  </div>
                  <div>
                    <small>Collection</small>
                    <Link
                      href={taxonomyHref(
                        products,
                        "Collections",
                        productCollection(selected),
                      )}
                    >
                      {productCollection(selected)} <ArrowUpRight size={13} />
                    </Link>
                  </div>
                  <div>
                    <small>For</small>
                    <Link href={collectionHref("All", selected.gender)}>
                      {selected.gender} <ArrowUpRight size={13} />
                    </Link>
                  </div>
                  {scentFamily(selected) && (
                    <div>
                      <small>Scent family</small>
                      <Link href={collectionHref(scentFamily(selected))}>
                        <ScentIcon family={scentFamily(selected)} />
                        {scentFamily(selected)} <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
                <p>{selected.concentration}</p>
                <div className="size-options">
                  {productSizes(selected).map((n) => (
                    <button
                      key={n}
                      aria-pressed={size === n}
                      className={size === n ? "selected" : ""}
                      onClick={() => {
                        setSize(n);
                        setQuantity(1);
                      }}
                    >
                      {n} ml
                    </button>
                  ))}
                </div>
                <div className="detail-price">
                  {money(priceFor(selected, size, currency))}
                  <small>
                    {stockFor(selected, size) > 0 ? "Available" : "Unavailable"}
                  </small>
                </div>
                <div className="quantity-control">
                  <span id="product-quantity-label">Quantity</span>
                  <div
                    className="quantity-stepper"
                    role="group"
                    aria-labelledby="product-quantity-label"
                  >
                    <button
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <output aria-live="polite" aria-label="Quantity">
                      {quantity}
                    </output>
                    <button
                      aria-label="Increase quantity"
                      disabled={
                        quantity >= Math.min(10, stockFor(selected, size))
                      }
                      onClick={() =>
                        setQuantity((n) =>
                          Math.min(
                            Math.min(10, stockFor(selected, size)),
                            n + 1,
                          ),
                        )
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  className="primary full"
                  disabled={
                    !selected.stock ||
                    !stockFor(selected, size) ||
                    priceFor(selected, size, currency) === null
                  }
                  onClick={() => add(selected, size, true, quantity)}
                >
                  Add to bag <Plus size={18} />
                </button>
                <details open>
                  <summary>
                    When to wear it <Plus size={15} />
                  </summary>
                  <p>
                    {selected.occasion} · {selected.season}
                  </p>
                </details>
                <details>
                  <summary>
                    Ingredients & care <Plus size={15} />
                  </summary>
                  <p>{selected.ingredients}</p>
                  <p>{selected.care}</p>
                </details>
                <details>
                  <summary>
                    Delivery & returns <Plus size={15} />
                  </summary>
                  <p>
                    Delivery availability and charges depend on your
                    destination.{" "}
                    <Link href="/shipping">View delivery information →</Link>
                  </p>
                </details>
              </div>
            </div>
            {sameBrandProducts(products, selected).length > 0 && (
              <section className="related">
                <span className="eyebrow">KEEP EXPLORING</span>
                <h2>
                  A little more <em>for you.</em>
                </h2>
                <div className="product-grid">
                  {sameBrandProducts(products, selected).map((p) => (
                    <Card p={p} key={p.id} />
                  ))}
                </div>
              </section>
            )}
          </section>
        )}
        {view === "about" && <OurStory />}
        {view === "store" && <StoreLanding slug={storeSlug} />}
        {view === "stores" && <StoreDirectory />}
        {content && view !== "about" && view !== "stores" && (
          <section className="content-page">
            <span className="eyebrow">THE LRT WORLD</span>
            <h1>{content.title}</h1>
            <p className="intro">{content.intro}</p>
            <div className="content-sections">
              {content.sections.map(([title, text]) => (
                <section key={title}>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </section>
              ))}
            </div>
            {view === "contact" && (
              <div className="contact-actions">
                <a
                  className="primary"
                  href="https://wa.me/97430100850"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp ↗
                </a>
                <a className="text-link" href="tel:+97430100850">
                  Call +974 3010 0850
                </a>
              </div>
            )}
            {content.source && (
              <p className="source-note">
                <a href={content.source} target="_blank" rel="noreferrer">
                  Read the full LRT Perfumes information ↗
                </a>
              </p>
            )}
            <Link className="primary" href="/shop">
              Explore all fragrances <ArrowRight size={18} />
            </Link>
          </section>
        )}
        {view === "checkout" && (
          <section className="checkout-page">
            <div className="checkout-heading">
              <Link className="text-link" href="/shop">
                <ArrowLeft size={16} /> Continue shopping
              </Link>
              <span className="eyebrow">YOUR NEXT SIGNATURE</span>
              <h1>
                A little luxury.
                <br />
                <em>Almost yours.</em>
              </h1>
              <p>
                Delivery details, your preferred payment, and one final look.
              </p>
            </div>
            {!ready ? (
              <p role="status">Opening your bag…</p>
            ) : !lines.length ? (
              <div className="checkout-empty">
                <ShoppingBag size={40} />
                <h2>Your bag is waiting.</h2>
                <p>Choose your fragrance before checking out.</p>
                <Link className="primary" href="/shop">
                  Discover the collection <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="checkout-layout">
                <section className="checkout-form">
                  <h2>01 · Delivery details</h2>
                  <p className="notice">
                    {mode === "wordpress" && !commerceEnabled
                      ? "Online ordering is not yet available. Please contact our team for assistance."
                      : mode === "demo"
                        ? "Demo checkout — use sample details. No payment is collected and no order is sent."
                        : "Your order will be confirmed with the store. Card details are entered on the payment provider’s secure page."}
                  </p>
                  <form
                    onSubmit={checkout}
                    onChange={() => {
                      requestId.current = null;
                    }}
                  >
                    <div className="form-grid">
                      <label>
                        First name
                        <input
                          required
                          name="firstName"
                          autoComplete="given-name"
                        />
                      </label>
                      <label>
                        Last name
                        <input
                          required
                          name="lastName"
                          autoComplete="family-name"
                        />
                      </label>
                    </div>
                    <label>
                      Email
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        required
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+971 or +974"
                      />
                    </label>
                    <div className="form-grid">
                      <label>
                        Country
                        <select
                          value={country}
                          onChange={(e) => chooseMarket(e.target.value)}
                        >
                          <option value="AE">United Arab Emirates</option>
                          <option value="QA">Qatar</option>
                        </select>
                      </label>
                      <label>
                        City
                        <select name="city" required key={country}>
                          <option value="">Choose city</option>
                          {cities[country].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label>
                      Address
                      <input
                        required
                        name="address"
                        autoComplete="street-address"
                        placeholder="Street, building, apartment / zone"
                      />
                    </label>
                    <label>
                      Order note (optional)
                      <textarea name="note" maxLength={500} />
                    </label>
                    <fieldset className="payment-cards">
                      <legend>02 · Choose your payment</legend>
                      {[
                        [
                          "cod",
                          "Cash on delivery",
                          "Pay when your fragrance arrives.",
                          Banknote,
                        ],
                        [
                          "card",
                          "Credit or debit card",
                          mode === "demo"
                            ? "Try a simulated card order."
                            : "Continue to the secure payment page.",
                          CreditCard,
                        ],
                      ].map(([v, title, note, Icon]) => (
                        <label
                          key={v}
                          className={
                            payment === v
                              ? "payment-card selected"
                              : "payment-card"
                          }
                        >
                          <input
                            type="radio"
                            name="method"
                            value={v}
                            checked={payment === v}
                            onChange={() => setPayment(v)}
                          />
                          <Icon size={25} />
                          <span>
                            <strong>{title}</strong>
                            <small>{note}</small>
                          </span>
                          <Check className="payment-check" size={18} />
                        </label>
                      ))}
                    </fieldset>
                    <div className="totals checkout-form-totals">
                      <p>
                        <span>Items</span>
                        <span>{money(subtotal)}</span>
                      </p>
                      <p>
                        <span>Delivery</span>
                        <span>
                          {shipping ? money(shipping) : "Complimentary"}
                        </span>
                      </p>
                      <p className="total">
                        <span>Estimated total</span>
                        <span>{money(subtotal + shipping)}</span>
                      </p>
                    </div>
                    {checkError && (
                      <p role="alert" className="error">
                        {checkError}
                      </p>
                    )}
                    <label className="checkout-agreement">
                      <input required type="checkbox" name="terms" />{" "}
                      <span>
                        {mode === "demo"
                          ? "For this simulated checkout, I acknowledge the sample "
                          : "I agree to the "}{" "}
                        <Link href="/terms" target="_blank">
                          terms & conditions
                        </Link>{" "}
                        and have read the{" "}
                        <Link href="/privacy" target="_blank">
                          privacy policy
                        </Link>
                        .
                      </span>
                    </label>
                    <button
                      disabled={
                        busy ||
                        !lines.length ||
                        unavailable ||
                        (mode === "wordpress" && !commerceEnabled)
                      }
                      className="primary full"
                    >
                      {busy
                        ? "Preparing your order…"
                        : mode === "demo"
                          ? "Place test order"
                          : payment === "card"
                            ? "Continue to secure payment"
                            : "Place order"}
                      <ArrowRight size={18} />
                    </button>
                    <p className="fine">
                      All amounts in {currency}.{" "}
                      {mode === "demo"
                        ? "Demo prices only."
                        : "Final taxes and total are calculated on the server."}
                    </p>
                  </form>
                </section>
                <aside className="checkout-summary">
                  <span className="eyebrow">SELECTED BY YOU</span>
                  <h2>
                    Your scent wardrobe <small>({count})</small>
                  </h2>
                  {lines.map((i) => (
                    <div className="checkout-line" key={i.id + "-" + i.size}>
                      <Bottle product={i.p} volume={i.size} small />
                      <div>
                        <Link href={"/product/" + i.p.slug}>{i.p.name}</Link>
                        <small>
                          {i.size} ml · Qty {i.qty}
                        </small>
                      </div>
                      <strong>
                        {money(
                          priceFor(i.p, i.size, currency) === null
                            ? null
                            : priceFor(i.p, i.size, currency) * i.qty,
                        )}
                      </strong>
                    </div>
                  ))}
                  <div className="totals">
                    <p>
                      <span>Subtotal</span>
                      <span>{money(subtotal)}</span>
                    </p>
                    <p>
                      <span>Delivery</span>
                      <span>
                        {shipping ? money(shipping) : "Complimentary"}
                      </span>
                    </p>
                    <p className="total">
                      <span>Estimated total</span>
                      <span>{money(subtotal + shipping)}</span>
                    </p>
                  </div>
                  {unavailable && (
                    <p role="alert" className="error">
                      One or more items are unavailable for this market. Update
                      your bag before continuing.
                    </p>
                  )}
                  <button className="text-link" onClick={() => setPanel("bag")}>
                    Edit your bag <ShoppingBag size={15} />
                  </button>
                  <p className="checkout-assurance">
                    <LockKeyhole size={17} />{" "}
                    {mode === "demo"
                      ? "Demonstration only · No payment collected"
                      : "Payment processed by your selected provider"}
                  </p>
                  <div className="checkout-help">
                    <strong>Need a hand?</strong>
                    <a href="https://wa.me/97430100850">
                      Chat with LRT · +974 3010 0850 ↗
                    </a>
                    <Link href="/shipping">Delivery information</Link>
                  </div>
                </aside>
              </div>
            )}
          </section>
        )}
        {view === "cart" && (
          <section className="content-page">
            <h1>Your bag</h1>
            <p>Continue your fragrance journey.</p>
            <button
              className="primary"
              onClick={() => setPanel(view === "cart" ? "bag" : view)}
            >
              Open {view}
            </button>
          </section>
        )}
      </main>
      <Footer
        mode={mode}
        currency={currency}
        collections={collectionsFor(products)}
      />
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{toast}</span>
          {cartNotice && (
            <button
              onClick={() => {
                setPanel("bag");
                setToast("");
              }}
            >
              View cart <ArrowRight size={15} />
            </button>
          )}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {panel === "search" && (
        <Modal wide label="Search fragrances" onClose={close}>
          <div className="search-heading">
            <span className="eyebrow">LET YOUR NOTES LEAD YOU</span>
            <h2>
              What speaks to <em>you?</em>
            </h2>
          </div>
          <div className="search-box">
            <Search />
            <input
              ref={searchInput}
              autoFocus
              placeholder="Search scents or ingredients"
              value={query}
              aria-label="Search scents"
              role="combobox"
              aria-expanded={Boolean(query.trim())}
              aria-controls="search-results"
              aria-activedescendant={
                activeResult >= 0 ? `result-${activeResult}` : undefined
              }
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveResult(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && query.trim()) {
                  e.preventDefault();
                  setActiveResult((n) =>
                    Math.min(n + 1, Math.min(results.length, 6) - 1),
                  );
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveResult((n) => Math.max(n - 1, 0));
                }
                if (e.key === "Enter") {
                  if (activeResult >= 0 && results[activeResult]) {
                    remember(query);
                    openProduct(results[activeResult]);
                  } else viewResults();
                }
              }}
            />
            {query && (
              <button
                className="icon"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  searchInput.current?.focus();
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="search-content">
            <aside>
              <h4>{query ? "Explore by note" : "Popular searches"}</h4>
              {["Vanilla", "Oud", "Rose", "Saffron", "Bergamot"].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setQuery(n);
                    setActiveResult(-1);
                  }}
                >
                  {n}
                  <ArrowUpRight size={14} />
                </button>
              ))}
              <h4>Shop by mood</h4>
              {(mobile
                ? availableFamilies
                : ["Fresh", "Floral", "Woody", "Sweet"]
              ).map((n) => (
                <button key={n} onClick={() => setQuery(n)}>
                  {n}
                </button>
              ))}
              {!!recent.length && (
                <>
                  <h4>Recent searches</h4>
                  {recent.map((n) => (
                    <button key={n} onClick={() => setQuery(n)}>
                      {n}
                    </button>
                  ))}
                </>
              )}
            </aside>
            <div
              className={
                "search-matches " + (!query.trim() ? "search-idle" : "")
              }
            >
              <div className="results-line">
                <span>
                  {query
                    ? `${results.length} matching fragrances`
                    : "Discover the collection"}
                </span>
                <button onClick={viewResults}>
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div
                id="search-results"
                role="listbox"
                aria-label="Matching fragrances"
              >
                {results.slice(0, 6).map((p, i) => (
                  <button
                    id={`result-${i}`}
                    role="option"
                    aria-selected={activeResult === i}
                    className={
                      "search-result " + (activeResult === i ? "focused" : "")
                    }
                    key={p.id}
                    onClick={() => {
                      remember(query);
                      openProduct(p);
                    }}
                  >
                    <Bottle product={p} small />
                    <span>
                      <strong className="result-name">
                        <ScentIcon family={scentFamily(p)} />
                        {p.name}
                      </strong>
                      <small>{p.notes.join(" · ")}</small>
                      <small>
                        {scentFamily(p)} · {p.gender}
                      </small>
                    </span>
                    <b>{money(priceFor(p, 50, currency))}</b>
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
              {!results.length && (
                <div className="empty">
                  <h3>No matches for “{query}”</h3>
                  <p>Try a note such as musk or vanilla.</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
      {panel === "product" && selected && (
        <Modal wide label={selected.name} onClose={close}>
          <div className="product-detail">
            <div className="detail-art">
              <Bottle product={selected} volume={size} />
              <span>
                {scentFamily(selected).toUpperCase()} /{" "}
                {selected.gender.toUpperCase()}
              </span>
            </div>
            <div className="detail-copy">
              <span className="eyebrow">
                LRT Perfumes COLLECTION · NO.{" "}
                {String(selected.id).padStart(2, "0")}
              </span>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <span className="eyebrow">{selected.concentration}</span>
              <div className="size-options">
                {productSizes(selected).map((s) => (
                  <button
                    className={size === s ? "selected" : ""}
                    key={s}
                    onClick={() => setSize(s)}
                  >
                    {s} ml
                  </button>
                ))}
              </div>
              <div className="detail-price">
                {money(priceFor(selected, size, currency))}
                <small>
                  {selected.stock > 0 ? "Available" : "Sold out"} · Sample
                  product
                </small>
              </div>
              <button
                className="primary full"
                disabled={
                  !selected.stock ||
                  !stockFor(selected, size) ||
                  priceFor(selected, size, currency) === null
                }
                onClick={() => add(selected, size)}
              >
                Add to bag <Plus size={18} />
              </button>
              <div className="note-breakdown">
                {["Top", "Heart", "Base"].map((n, i) => (
                  <div key={n}>
                    <small>{n} note</small>
                    <span>{selected.notes[i]}</span>
                  </div>
                ))}
              </div>
              <details open>
                <summary>
                  The feeling <Plus size={15} />
                </summary>
                <p>
                  {selected.occasion} · {selected.season}
                </p>
              </details>
              <details>
                <summary>
                  Ingredients & care <Plus size={15} />
                </summary>
                <p>{selected.ingredients}</p>
                <p>{selected.care}</p>
              </details>
              <details>
                <summary>
                  Delivery <Plus size={15} />
                </summary>
                <p>
                  Qatar: complimentary delivery. UAE preview: AED 20, free from
                  AED 250. Your selected market determines your currency.
                </p>
              </details>
            </div>
          </div>
        </Modal>
      )}
      {panel === "bag" && (
        <Modal label="Shopping bag" onClose={close}>
          <span className="eyebrow">YOUR SCENT WARDROBE</span>
          <h2>
            The bag <em>({count})</em>
          </h2>
          {lines.length ? (
            <>
              <p className="shipping-note">
                {subtotal >= market.freeAt
                  ? "Your order qualifies for complimentary shipping."
                  : `${money(market.freeAt - subtotal)} away from complimentary shipping.`}
              </p>
              <div className="progress">
                <i
                  style={{
                    width:
                      (market.freeAt
                        ? Math.min((subtotal / market.freeAt) * 100, 100)
                        : 100) + "%",
                  }}
                />
              </div>
              <div className="bag-lines">
                {lines.map((i) => (
                  <div className="bag-line" key={i.id + "-" + i.size}>
                    <Bottle product={i.p} volume={i.size} small />
                    <div>
                      <button
                        className="line-name"
                        onClick={() => openProduct(i.p)}
                      >
                        {i.p.name}
                      </button>
                      <small>
                        {i.size} ml · {scentFamily(i.p)}
                      </small>
                      <div className="quantity">
                        <button
                          aria-label={`Remove one ${i.p.name}`}
                          onClick={() => changeQty(i, -1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span>{i.qty}</span>
                        <button
                          aria-label={`Add one ${i.p.name}`}
                          onClick={() => changeQty(i, 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <b>
                        {money(
                          priceFor(i.p, i.size, currency) === null
                            ? null
                            : priceFor(i.p, i.size, currency) * i.qty,
                        )}
                      </b>
                      <button
                        className="remove"
                        onClick={() =>
                          setBag((b) =>
                            b.filter(
                              (x) => !(x.id === i.id && x.size === i.size),
                            ),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="totals">
                <p>
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </p>
                <p>
                  <span>Delivery to {country === "AE" ? "UAE" : "Qatar"}</span>
                  <span>{shipping ? money(shipping) : "Complimentary"}</span>
                </p>
                <p className="total">
                  <span>Estimated total</span>
                  <span>{money(subtotal + shipping)}</span>
                </p>
              </div>
              {unavailable && (
                <p className="error">
                  A saved size is unavailable in this market. Remove it or
                  choose a supported size on its product page.
                </p>
              )}
              <button
                disabled={unavailable}
                className="primary full"
                onClick={() => {
                  setPanel(null);
                  router.push("/checkout");
                }}
              >
                Continue to checkout <ArrowRight size={18} />
              </button>
              <p className="fine">
                {mode === "demo"
                  ? "Test store. No real payment or delivery."
                  : "Final totals and applicable taxes are calculated by WooCommerce."}
              </p>
            </>
          ) : (
            <div className="empty">
              <ShoppingBag size={38} />
              <h3>A little room for something lovely.</h3>
              <p>Your bag is waiting for your signature.</p>
              <button className="primary" onClick={() => shop()}>
                Explore the collection
              </button>
            </div>
          )}
        </Modal>
      )}
      {panel === "receipt" && (
        <Modal label="Order confirmation" onClose={close}>
          <div className="receipt">
            <div className="success-circle">
              <Check />
            </div>
            <span className="eyebrow">
              {receipt.mode === "demo" ? "TEST COMPLETE" : "THANK YOU"}
            </span>
            <h2>
              {receipt.mode === "demo"
                ? "A little trial run."
                : "Your scent awaits."}
            </h2>
            <p>
              {receipt.mode === "demo"
                ? "Your simulated checkout completed. No money was collected, no real order was saved, and nothing will be shipped."
                : payment === "cod"
                  ? "Your order has been received. Pay when your order arrives."
                  : "WooCommerce has confirmed your order status."}
            </p>
            <div className="notice">
              Reference: {receipt.id}
              <br />
              Total: {money(receipt.total, receipt.currency)}
            </div>
            <button className="primary" onClick={() => shop()}>
              Back to the collection <ArrowRight size={18} />
            </button>
          </div>
        </Modal>
      )}
      {panel === "quiz" && (
        <Modal label="Find your scent" onClose={close}>
          <span className="eyebrow">A MOMENT OF DISCOVERY</span>
          <h2>
            Follow your <em>feeling.</em>
          </h2>
          <p>What kind of scent feels most like you?</p>
          <div className="quiz-options">
            {availableFamilies.map((f) => (
              <button
                className={quiz === f ? "selected" : ""}
                key={f}
                onClick={() => setQuiz(f)}
              >
                <strong>{f}</strong>
                <ScentIcon family={f} size={26} />
                {quiz === f && <Check size={16} />}
              </button>
            ))}
          </div>
          <button
            className="primary full"
            disabled={!availableFamilies.length}
            onClick={() =>
              shop(representedFamilies.has(quiz) ? quiz : availableFamilies[0])
            }
          >
            Meet your matches <ArrowRight size={18} />
          </button>
        </Modal>
      )}
      {[
        "filters",
        "family-filter",
        "gender-filter",
        "brand-filter",
        "sort-filter",
      ].includes(panel) && (
        <Modal
          drawer
          label={
            panel === "brand-filter"
              ? "Brand"
              : panel === "family-filter"
                ? "Scent family"
                : panel === "gender-filter"
                  ? "Gender"
                  : panel === "sort-filter"
                    ? "Sort by"
                    : "Filter"
          }
          onClose={() => setPanel(null)}
        >
          <div className="filter-drawer">
            <h2>
              {panel === "brand-filter"
                ? "Brand"
                : panel === "family-filter"
                  ? "Scent family"
                  : panel === "gender-filter"
                    ? "Gender"
                    : panel === "sort-filter"
                      ? "Sort by"
                      : "Filter"}
            </h2>
            {["filters", "sort-filter"].includes(panel) && (
              <label className="filter-sort">
                Sort by
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {[
                    ["featured", "Featured"],
                    ["best", "Bestsellers"],
                    ["newest", "Newest"],
                    ["low", "Price: low to high"],
                    ["high", "Price: high to low"],
                    ["name", "Name: A–Z"],
                  ].map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {["filters", "gender-filter"].includes(panel) && (
              <fieldset>
                <legend>Gender</legend>
                {["Women", "Men", "Unisex"].map((g) => (
                  <label key={g}>
                    <input
                      type="checkbox"
                      checked={genders.includes(g)}
                      onChange={() =>
                        setGenders((v) =>
                          v.includes(g) ? v.filter((x) => x !== g) : [...v, g],
                        )
                      }
                    />
                    {g}
                    <span>{products.filter((p) => p.gender === g).length}</span>
                  </label>
                ))}
              </fieldset>
            )}
            {["filters", "family-filter"].includes(panel) && (
              <fieldset>
                <legend>Scent family</legend>
                {availableFamilies.map((f) => (
                  <label key={f}>
                    <input
                      type="checkbox"
                      checked={families.includes(f)}
                      onChange={() =>
                        setFamilies((v) =>
                          v.includes(f) ? v.filter((x) => x !== f) : [...v, f],
                        )
                      }
                    />
                    <ScentIcon family={f} />
                    {f}
                    <span>
                      {products.filter((p) => scentFamily(p) === f).length}
                    </span>
                  </label>
                ))}
              </fieldset>
            )}
            {["filters", "brand-filter"].includes(panel) && (
              <fieldset>
                <legend>Brand</legend>
                <div className="brand-filter-search">
                  <Search size={17} />
                  <input
                    type="search"
                    aria-label="Search brands"
                    placeholder="Find a brand"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                  />
                  {brandSearch && (
                    <button
                      aria-label="Clear brand search"
                      onClick={() => setBrandSearch("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {!collectionsFor(products).some(
                  (c) =>
                    c.group === "Brands" &&
                    c.title
                      .toLowerCase()
                      .includes(brandSearch.trim().toLowerCase()),
                ) && (
                  <p className="brand-filter-empty" role="status">
                    No brands match this search.
                  </p>
                )}
                {collectionsFor(products)
                  .filter(
                    (c) =>
                      c.group === "Brands" &&
                      c.title
                        .toLowerCase()
                        .includes(brandSearch.trim().toLowerCase()),
                  )
                  .map((c) => (
                    <label key={c.slug}>
                      <input
                        type="checkbox"
                        checked={brands.includes(c.title)}
                        onChange={() =>
                          setBrands((v) =>
                            v.includes(c.title)
                              ? v.filter((x) => x !== c.title)
                              : [...v, c.title],
                          )
                        }
                      />
                      {c.title}
                      <span>{products.filter(c.match).length}</span>
                    </label>
                  ))}
              </fieldset>
            )}
            <div className="filter-bottom">
              <button
                className="text-link"
                onClick={() => {
                  if (panel === "brand-filter") setBrands([]);
                  else if (panel === "family-filter") setFamilies([]);
                  else if (panel === "gender-filter") setGenders([]);
                  else if (panel === "sort-filter") setSort("featured");
                  else {
                    setFamilies([]);
                    setGenders([]);
                    setBrands([]);
                    setSort("featured");
                  }
                }}
              >
                Clear all
              </button>
              <button className="primary" onClick={() => setPanel(null)}>
                Show {shown.length} results <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Modal>
      )}
      {panel === "menu" && (
        <Modal drawer label="Navigation" onClose={close}>
          <Link href="/" className="drawer-brand">
            <img src="/logo.png" alt="" />
            LRT Perfumes
          </Link>
          <button className="drawer-search" onClick={() => setPanel("search")}>
            <Search size={18} /> Find your next scent
          </button>
          <div className="mobile-links">
            <Link href="/shop" onClick={close}>
              Perfumes
            </Link>
            {primaryNavigation.map(([label, href]) => (
              <Link key={href} href={href} onClick={close}>
                {label}
              </Link>
            ))}
            <details>
              <summary>
                Shop by gender <Plus size={16} />
              </summary>
              {["Women", "Men", "Unisex"].map((g) => (
                <button key={g} onClick={() => shop("All", g)}>
                  {g}
                </button>
              ))}
            </details>
            <details>
              <summary>
                Scent families <Plus size={16} />
              </summary>
              {availableFamilies.map((f) => (
                <button key={f} onClick={() => shop(f)}>
                  <ScentIcon family={f} />
                  {f}
                </button>
              ))}
            </details>
            <button onClick={() => shop("Favorites")}>
              Favorite fragrances ({saved.length}) <Heart size={18} />
            </button>

            <details>
              <summary>
                About & information <Plus size={16} />
              </summary>
              {[
                ["FAQs", "faq"],
                ["Fragrance guide", "fragrance-guide"],
                ["Delivery", "shipping"],
                ["Returns", "returns"],
                ["Privacy", "privacy"],
                ["Terms", "terms"],
                ["Disclaimer", "disclaimer"],
              ].map(([n, u]) => (
                <Link key={u} href={"/" + u}>
                  {n}
                </Link>
              ))}
            </details>
          </div>
          <div className="drawer-market">
            <small>YOUR SHOPPING REGION</small>
            <MarketPicker country={country} onChange={chooseMarket} />
          </div>
        </Modal>
      )}
      {panel === "info" && (
        <Modal label={info} onClose={close}>
          <span className="eyebrow">THE LRT WORLD</span>
          <h2>{info}</h2>
          {info === "Our story" ? (
            <>
              {mobilePageContent.about.sections.map(([t, p]) => (
                <div key={t}>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </>
          ) : info === "Delivery & returns" ? (
            <>
              <h3>Across UAE & Qatar</h3>
              <p>
                Sample delivery areas: {cities.AE.join(", ")};{" "}
                {cities.QA.join(", ")}.
              </p>
              <p>
                Qatar delivery is complimentary in this preview. UAE preview
                delivery costs AED 20, free from AED 250. Prices use the
                selected market currency.
              </p>
              <h3>Returns</h3>
              <p>
                Request eligible returns within 7 days. Report arrival damage
                within 24 hours with photos. See the dedicated returns page for
                conditions.
              </p>
            </>
          ) : info === "Fragrance care" ? (
            <>
              <p>
                Apply lightly to pulse points and allow the fragrance to settle.
                Avoid rubbing your wrists together.
              </p>
              <p>
                Keep your bottle cool and away from direct sunlight. Avoid eyes,
                broken skin and flames. Stop use if irritation occurs.
              </p>
            </>
          ) : info === "Contact us" ? (
            <>
              <p>Contact LRT Perfumes:</p>
              <p>
                <strong>lrtperfumes.com</strong>
                <br />
                UAE: +971 58 965 1244
                <br />
                Qatar: +974 3010 0850
              </p>
              <p>Contact our stores for fragrance and order assistance.</p>
            </>
          ) : (
            <>
              <p>
                This demonstration stores your bag, favourites and recent
                searches in your browser. Standalone test checkout does not save
                personal details to a database.
              </p>
              <p>
                When WordPress is connected, checkout details are sent to your
                store to process orders. Card details are handled on the
                configured payment provider’s checkout.
              </p>
              <p>
                This is sample policy text, not a final legal policy. Replace it
                with your business terms, privacy notice, tax and returns
                information before launch.
              </p>
              <button
                className="text-link"
                onClick={() => {
                  localStorage.removeItem("lrt-recent");
                  setRecent([]);
                  setFavorites([]);
                  setBag([]);
                  notify("Local shopping data cleared.");
                }}
              >
                Clear my local shopping data <X size={16} />
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
