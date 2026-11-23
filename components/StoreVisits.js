"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, Droplets, Gift } from "lucide-react";
import Link from "./StoreLink";
import { WhatsAppIcon } from "./SocialLinks";
import { stores } from "../lib/story-content";
import { openingHours, storeExperiences } from "../lib/store-experiences";
import styles from "./StoreVisits.module.css";

const whatsapp = (store) => "https://wa.me/" + store.tel.replace(/\D/g, "");

export function BranchCards({ branches = stores }) {
  return (
    <div className={styles.grid}>
      {branches.map((store) => (
        <article className={styles.card} key={store.slug} style={{ "--branch": store.tint }}>
          <div className={styles.facade} aria-hidden="true">
            <span>LRT <small>PERFUMES</small></span>
          </div>
          <div className={styles.awning} aria-hidden="true" />
          <div className={styles.cardBody}>
            <div className={styles.location}>{store.country}, {store.area}</div>
            <h3><Link href={"/stores/" + store.slug}>{store.name}</Link></h3>
            <address>{store.address}</address>
            <p className={styles.hours}><Clock size={16} aria-hidden="true" /><span>{openingHours}</span></p>
            <div className={styles.phoneRow}>
              <a href={store.tel}><Phone size={16} aria-hidden="true" />{store.phone}</a>
              <a className={styles.whatsapp} href={whatsapp(store)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp LRT ${store.name}`} title={`WhatsApp ${store.name}`}><WhatsAppIcon /></a>
            </div>
            <Link className={styles.storeLink} href={"/stores/" + store.slug}>Visit this store</Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function MapRoom({ branch }) {
  const [selected, setSelected] = useState(stores[0].slug);
  const store = branch || stores.find((item) => item.slug === selected);
  return (
    <section className={styles.mapRoom} aria-label="Store directions">
      <div className={styles.mapIndex}>
        <h2>Find your store</h2>
        {!branch && (
          <div className={styles.mapChoices}>
            {stores.map((item) => (
              <button key={item.slug} aria-pressed={item.slug === selected} onClick={() => setSelected(item.slug)}>
                {item.name}<MapPin size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
        <h3>{store.area}</h3>
        <address>{store.address}</address>
        <a className="text-link" href={store.map} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
      </div>
      <iframe key={store.slug} src={store.embed} title={"Map to LRT Perfumes " + store.name} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </section>
  );
}

export function StoreDirectory() {
  return (
    <article className={styles.directory}>
      <section className={styles.section}>
        <h1>Our stores.</h1>
        <p>Come in, take your time, and find a scent that feels like you.</p>
        <BranchCards />
      </section>
      <MapRoom />
    </article>
  );
}

export function StoreLanding({ slug }) {
  const store = stores.find((item) => item.slug === slug);
  if (!store) return null;
  const experience = storeExperiences[slug];
  return (
    <article className={styles.visit}>
      <section className={styles.hero} style={{ "--branch": store.tint }}>
        <div className={styles.heroImage}><img src={store.hero} alt="LRT perfume and fragrance ingredients" fetchPriority="high" /></div>
        <div className={styles.heroCopy}>
          <h1>LRT Perfumes<br />{store.name}.</h1>
          <p>{store.intro}</p>
          <p className={styles.heroHours}><Clock size={18} aria-hidden="true" />{openingHours}</p>
          <div className={styles.actions}>
            <a className="primary" href={store.map} target="_blank" rel="noopener noreferrer"><MapPin size={18} aria-hidden="true" />Get directions</a>
            <a className={styles.chatLink} href={whatsapp(store)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Chat with this store</a>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.introduction}`}>
        <h2>{experience.heading}</h2>
        <div><p>{experience.story}</p><p>{experience.visit}</p></div>
      </section>

      <section className={`${styles.section} ${styles.plan}`}>
        <h2>Plan your visit</h2>
        <dl className={styles.facts}>
          <div><MapPin aria-hidden="true" /><dt>Find the store</dt><dd>{store.address}</dd></div>
          <div><Clock aria-hidden="true" /><dt>Opening hours</dt><dd>{openingHours}<br />Monday to Sunday</dd></div>
          <div><Phone aria-hidden="true" /><dt>Speak to the team</dt><dd><div className={styles.phoneRow}><a href={store.tel}>{store.phone}</a><a className={styles.whatsapp} href={whatsapp(store)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp LRT ${store.name}`}><WhatsAppIcon /></a></div>Ask about a scent before you visit.</dd></div>
        </dl>
      </section>

      <section className={styles.discovery}>
        <img src={experience.image} alt="LRT perfume surrounded by scent ingredients" loading="lazy" />
        <div>
          <h2>Try a fragrance on your skin</h2>
          <ul className={styles.experiences}>
            <li><Droplets aria-hidden="true" /><div><h3>Discover your notes</h3><p>Fresh, floral, woody or warm. Explore the families you’re drawn to.</p></div></li>
            <li><Droplets aria-hidden="true" /><div><h3>Compare on skin</h3><p>Try your shortlist on your skin and give the opening notes time to settle before choosing.</p></div></li>
            <li><Gift aria-hidden="true" /><div><h3>Choose a thoughtful gift</h3><p>Share a little about the person you’re choosing for. We’ll help you find a starting point.</p></div></li>
          </ul>
          <Link className="text-link" href="/shop">Explore the perfumes</Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.visitNotes}`}>
        <div><h2>Bring a starting point. Leave room for a surprise.</h2><p>A photo of a favourite bottle, a fragrance name or a note you enjoy can help the {store.name} team understand your taste. If you are buying a gift, bring an idea of what the person already wears.</p><a className={styles.chatLink} href={whatsapp(store)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Send your shortlist to {store.name}</a></div>
        <div className={styles.visitChecklist}><h3>Make the most of your visit</h3><ul><li>Try a few fragrances at a time so you can compare them comfortably.</li><li>Let a fragrance dry on your skin without rubbing it in.</li><li>Take a walk and revisit your favourite as the notes develop.</li><li>Ask the team about the available bottle sizes and current prices.</li></ul></div>
      </section>
      <MapRoom branch={store} />
      <section className={`${styles.section} ${styles.questions}`}>
        <h2>Before you visit</h2>
        <div>
          <details><summary>How do I find the shop?</summary><p>{experience.note}</p></details>
          <details><summary>Can I check a fragrance before visiting?</summary><p>Of course. Send the {store.name} team a WhatsApp message with the fragrance name and size you have in mind. They can confirm availability for your visit.</p></details>
          <details><summary>Do I need to know what I’m looking for?</summary><p>Come with a favourite note, a perfume you enjoy, or just a little curiosity. We can explore a few options together.</p></details>
          <details><summary>Can you help me choose a gift?</summary><p>Tell the team about the recipient’s favourite scents and your budget. Message ahead if you would like to check gift packaging or a particular bottle size.</p></details>
          <details><summary>Where should I park or get dropped off?</summary><p>Contact the {store.name} team for the current access and parking options near {store.area}. They can share directions to the entrance before you leave.</p></details>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Other LRT stores</h2>
        <p>Explore our other stores in Qatar and the UAE.</p>
        <BranchCards branches={stores.filter((item) => item.slug !== slug)} />
      </section>
    </article>
  );
}
