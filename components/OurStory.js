import Link from "./StoreLink";
import { ArrowUpRight } from "lucide-react";
import { BranchCards, MapRoom } from "./StoreVisits";
import {
  Droplets,
  Flower2,
  MessageCircle,
  Gift,
  MapPin,
  Sprout,
} from "lucide-react";
import { testimonials } from "../lib/story-content";

const icons = [Droplets, Flower2, MessageCircle, Gift, MapPin, Sprout];
const principles = [
  ["Quality", "We select imported perfume oils for depth and lasting wear."],
  [
    "Inspired editions",
    "Alongside our original blends, we create accessible interpretations of familiar fragrances.",
  ],
  [
    "Customer care",
    "What you tell us at the counter helps shape the next blend.",
  ],
  [
    "The finishing touches",
    "We give the packaging the same care as the perfume inside.",
  ],
  [
    "Made in Qatar",
    "Our local community has been part of LRT since the beginning.",
  ],
  [
    "Room to grow",
    "New scents, new shops and an online store help us meet more fragrance lovers.",
  ],
];

export default function OurStory() {
  return (
    <article className="lrt-story">
      <div className="story-opening atelier-cover">
        <div>
          <h1>
            Our <em>story.</em>
          </h1>
          <p>
            LRT began as a small perfume house in Qatar. From the Old Souq in Al
            Wakrah to Souq Waqif in Doha, fragrance has always been a
            conversation across our counter.
          </p>
          <a className="text-link" href="#story-stores">
            Visit our stores ↓
          </a>
        </div>
        <figure>
          <img src="/campaign-wide.webp" alt="LRT perfume surrounded by flowers, citrus and flowing pastel fabric" />
          <figcaption>Signature &amp; inspired editions</figcaption>
        </figure>
      </div>
      <section className="story-section story-making">
        <div>
          <h2>
            From Arabic oud
            <br />
            to French florals.
          </h2>
        </div>
        <div>
          <p>
            Our collection brings together over 400 oil-based perfumes, from
            deep Arabic ouds and French florals to modern unisex blends. We
            blend our signature scents in Qatar using imported oils.
          </p>
          <p>
            Our inspired editions explore familiar fragrance profiles at an
            accessible price. Discover your scent in person, or shop online for
            delivery across Qatar.
          </p>
          <Link className="text-link" href="/shop">
            Explore our perfumes <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="story-section">
        <h2>What goes into a bottle</h2>
        <dl className="story-principles">
          {principles.map(([name, text], index) => {
            const Icon = icons[index];
            return (
              <div key={name}>
                <Icon size={22} aria-hidden="true" />
                <dt>{name}</dt>
                <dd>{text}</dd>
              </div>
            );
          })}
        </dl>
      </section>
      <section id="story-stores" className="story-section">
        <h2>Visit our stores</h2>
        <p>Open daily, 9 am to midnight.</p>
        <BranchCards />
      </section>
      <MapRoom />
      <section className="story-section">
        <h2>Across the counter</h2>
        <details>
          <summary>Read customer stories</summary>
          <div className="story-quotes">
            {testimonials.map(({ name, text }) => (
              <figure key={name}>
                <blockquote>“{text}”</blockquote>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
        </details>
      </section>
    </article>
  );
}
