"use client";
import Link from "./StoreLink";
import { ArrowUpRight } from "lucide-react";
export default function Footer({ mode, currency, collections = [] }) {
  const explore = [
    ["All fragrances", "/shop"],
    ["Brands", "/brand"],
    ["Collections & families", "/collection"],
    ["Fragrance guide", "/fragrance-guide"],
  ];
  if (collections.some((c) => c.slug === "new-arrivals"))
    explore.splice(2, 0, ["New arrivals", "/collection/new-arrivals"]);
  const groups = [
    ["Explore", explore],
    [
      "Customer care",
      [
        ["Contact us", "/contact"],
        ["Questions & answers", "/faq"],
        ["Delivery", "/shipping"],
        ["Returns & refunds", "/returns"],
        ["Payment methods", "/payment-methods"],
      ],
    ],
    [
      "The house",
      [
        ["Our story", "/about"],
        ["Our stores", "/stores"],
        ["Product care", "/product-care"],
      ],
    ],
  ];
  return (
    <footer className="luxury-footer">
      <div className="footer-invitation">
        <span className="eyebrow">THE WORLD OF LRT</span>
        <Link href="/collection">
          Find a scent that feels like you.
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className="footer-grid">
        <div className="footer-identity">
          <Link
            href="/"
            className="footer-brand-lockup"
            aria-label="LRT Perfumes homepage"
          >
            <img src="/logo.png" width="64" height="64" alt="" />
            <span className="footer-wordmark">
              LRT<span>PERFUMES</span>
            </span>
          </Link>
          <p>
            Signature & inspired fragrances.
            <br />A little closer to you.
          </p>
          <Link href="/contact">
            Connect with our team <ArrowUpRight size={15} />
          </Link>
        </div>
        {groups.map(([title, links]) => (
          <nav aria-label={title + " footer"} key={title}>
            <h2>{title}</h2>
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="footer-service-row">
        <span>
          Find your signature <small>Explore by family, brand or mood</small>
        </span>
        <Link href="/stores">
          Visit LRT <small>Discover our stores ↗</small>
        </Link>
        <Link href="/contact">
          A personal touch <small>Speak with our fragrance team ↗</small>
        </Link>
      </div>
      <div className="footer-utility">
        <small>
          © {new Date().getFullYear()} LRT Perfumes
          {mode === "demo" ? " · Demonstration catalogue" : ""}
        </small>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms & conditions</Link>
          <Link href="/disclaimer">Inspired fragrance</Link>
          <Link href="/accessibility">Accessibility</Link>
          <button
            className="footer-cookie-control"
            onClick={() => window.dispatchEvent(new Event("lrt:open-consent"))}
          >
            Cookie preferences
          </button>
        </nav>
        <small>{currency} · UAE & QATAR</small>
      </div>
    </footer>
  );
}
