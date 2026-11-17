"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  Clock,
  Landmark,
  Waves,
  Sun,
  Store,
  Compass,
} from "lucide-react";
import Link from "./StoreLink";
import { stores } from "../lib/story-content";
const emblems = {
  dubai: Sun,
  mansoura: Store,
  doha: Landmark,
  "al-wakrah": Waves,
  "al-khor": Compass,
};
export function BranchCards({ branches = stores }) {
  return (
    <div className="branch-grid">
      {branches.map((s) => {
        const Icon = emblems[s.slug];
        return (
          <article
            className="branch-card"
            key={s.slug}
            style={{ "--branch": s.tint }}
          >
            <Link href={"/stores/" + s.slug}>
              <div className="branch-print">
                <small>{s.country}</small>
                <Icon size={48} strokeWidth={1} aria-hidden="true" />
              </div>
              <div className="branch-caption">
                <small>{s.area}</small>
                <h3>{s.name}</h3>
                <span>Visit this store ↗</span>
              </div>
            </Link>
            <div className="branch-contact">
              <address>{s.address}</address>
              <a href={s.tel}>{s.phone}</a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
export function MapRoom({ branch }) {
  const [selected, setSelected] = useState(stores[0].slug),
    s = branch || stores.find((s) => s.slug === selected);
  return (
    <section className="map-room">
      <div className="map-index">
        <p className="eyebrow">Directions</p>
        <h2>Find us on the map</h2>
        {!branch && (
          <div className="map-choices">
            {stores.map((x) => (
              <button
                key={x.slug}
                aria-pressed={x.slug === selected}
                onClick={() => setSelected(x.slug)}
              >
                {x.name}
                <MapPin size={15} />
              </button>
            ))}
          </div>
        )}
        <h3>{s.area}</h3>
        <address>{s.address}</address>
        <a className="text-link" href={s.map}>
          Open in Google Maps ↗
        </a>
      </div>
      <iframe
        key={s.slug}
        src={s.embed}
        title={"Map to LRT Perfumes " + s.name}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </section>
  );
}
export function StoreDirectory() {
  return (
    <article className="lrt-story">
      <section className="story-section">
        <p className="eyebrow">Qatar &amp; UAE</p>
        <h1>Our stores</h1>
        <p>
          Choose a store for visiting hours, contact details and directions.
        </p>
        <BranchCards />
      </section>
      <MapRoom />
    </article>
  );
}
export function StoreLanding({ slug }) {
  const s = stores.find((item) => item.slug === slug);
  return (
    <article className="lrt-story store-visit">
      <nav className="visit-crumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/stores">Our stores</Link> /{" "}
        {s.name}
      </nav>
      <section className="visit-hero" style={{ "--branch": s.tint }}>
        <img src={s.hero} alt="LRT fragrance campaign" />
        <div>
          <p className="eyebrow">
            {s.country} · {s.area}
          </p>
          <h1>
            LRT Perfumes
            <br />
            <em>{s.name}</em>
          </h1>
          <p>{s.intro}</p>
          <a className="visit-button" href={s.map}>
            Get directions <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="story-section">
        <h2>Plan your visit</h2>
        <dl className="visit-facts">
          <div>
            <MapPin />
            <dt>Find the store</dt>
            <dd>{s.address}</dd>
          </div>
          <div>
            <Clock />
            <dt>Opening hours</dt>
            <dd>
              Monday to Sunday
              <br />
              9:00 am – midnight
            </dd>
          </div>
          <div>
            <Phone />
            <dt>Speak to the team</dt>
            <dd>
              <a href={s.tel}>{s.phone}</a>
              <br />
              Call for product and size enquiries.
            </dd>
          </div>
        </dl>
      </section>
      <MapRoom branch={s} />
      <section className="story-section visit-perfumes">
        <div>
          <p className="eyebrow">At the perfume counter</p>
          <h2>Find your scent in person.</h2>
          <p>
            Explore our signature blends and inspired editions. If you have a
            perfume in mind, call the {s.name} team before visiting to check its
            availability.
          </p>
          <Link className="text-link" href="/shop">
            Browse perfumes ↗
          </Link>
        </div>
        <img src="/hero-mobile.webp" alt="LRT perfume with citrus and petals" />
      </section>
      <section className="story-section">
        <h2>Other LRT stores</h2>
        <BranchCards branches={stores.filter((x) => x.slug !== s.slug)} />
      </section>
    </article>
  );
}
