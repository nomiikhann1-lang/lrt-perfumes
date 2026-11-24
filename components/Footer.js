"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "./StoreLink";
import SocialLinks from "./SocialLinks";
import styles from "./Footer.module.css";

export default function Footer({ currency, collections = [] }) {
  const [expanded, setExpanded] = useState({});
  const groups = [
    ["Explore", [
      ["Shop all", "/shop"],
      ["Inspired Edition", "/collection/inspired-edition"],
      ["LRT Collection", "/collection/lrt-collection"],
      ["Brands", "/brand"],
      ...(collections.some((c) => c.slug === "new-arrivals") ? [["New arrivals", "/collection/new-arrivals"]] : []),
    ]],
    ["Customer care", [
      ["Contact us", "/contact"],
      ["Questions & answers", "/faq"],
      ["Delivery", "/shipping"],
      ["Returns & refunds", "/returns"],
      ["Payment methods", "/payment-methods"],
    ]],
    ["Our house", [
      ["Our story", "/about"],
      ["Our stores", "/stores"],
      ["Fragrance guide", "/fragrance-guide"],
      ["Product care", "/product-care"],
    ]],
  ];
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.identity}>
          <Link href="/" className={styles.brand} aria-label="LRT Perfumes homepage">
            <img src="/logo.png" width="44" height="44" alt="" />
            <span>LRT<small>PERFUMES</small></span>
          </Link>
          <p>Luxury in every scent.</p>
          <a className={styles.email} href="mailto:info@lrtperfumes.com">info@lrtperfumes.com</a>
        </div>
        {groups.map(([title, links], index) => (
          <nav key={title} className={styles.group} aria-label={`${title} footer`}>
            <h2>
              <span>{title}</span>
              <button type="button" aria-expanded={Boolean(expanded[index])} aria-controls={`footer-group-${index}`} onClick={() => setExpanded((value) => ({ ...value, [index]: !value[index] }))}>
                {title}<Plus size={17} />
              </button>
            </h2>
            <div id={`footer-group-${index}`} data-open={Boolean(expanded[index])}>
              {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </div>
          </nav>
        ))}
      </div>
      <div className={styles.socialRow}><SocialLinks /></div>
      <div className={styles.utility}>
        <nav aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms & conditions</Link>
          <Link href="/disclaimer">Inspired fragrance</Link>
          <button type="button" onClick={() => window.dispatchEvent(new Event("lrt:open-consent"))}>Cookie preferences</button>
        </nav>
        <div className={styles.copyright}>
          <span>AED, Qatar & United Arab Emirates</span>
          <span>© {new Date().getFullYear()} LRT Perfumes. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
