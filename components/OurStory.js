import Link from "./StoreLink";
import { BranchCards, MapRoom } from "./StoreVisits";

const ingredients = [
  ['Citrus', 'The first impression', 'Bright, crisp notes introduce a fragrance before the softer heart begins to unfold.', 'citrus'],
  ['Florals', 'At the heart', 'Rose, jasmine and other floral notes give a perfume its character as it settles.', 'floral'],
  ['Woods', 'The lasting impression', 'Woods and warm base notes stay with you after the opening notes have faded.', 'woody'],
  ['Amber', 'Depth and warmth', 'Amber accords bring together warm, resinous and sweet facets of a fragrance.', 'amber'],
];
export default function OurStory() {
  return <article className="lrt-story">
    <section className="story-intro">
      <div className="story-intro-copy"><h1>Our story</h1>
        <p className="story-lead">A favourite perfume often begins with a conversation.</p>
        <p>At LRT, that conversation starts at the perfume counter. A scent you remember. A note you always return to. Something you have never tried before.</p>
        <p>From Al Wakrah to Doha and Dubai, our stores bring together original LRT blends and inspired editions. Come in with an idea, try a few on your skin, and see what stays with you.</p>
        <a className="primary" href="#story-stores">Meet us in store</a>
      </div>
      <div className="story-composition"><img className="story-main-image" src="/editorial.webp" alt="LRT fragrance composition" fetchPriority="high" />
        <img className="story-ingredient story-ingredient-one" src="/scent-families/citrus.png" alt="" />
        <img className="story-ingredient story-ingredient-two" src="/scent-families/floral.png" alt="" />
        <span className="story-image-caption">LRT Perfumes, Qatar &amp; UAE</span>
      </div>
    </section>
    <section className="story-section story-notebook">
      <div><h2>There is no single way to wear a fragrance.</h2><p>Some people return to the same bottle for years. Others choose a different scent for the evening, the season or the occasion. Our collection leaves room for both.</p></div>
      <div><p>Start with what you enjoy. Compare a fresh citrus with a warm wood, or a familiar floral with an amber blend. Give each one time on your skin before you decide.</p><Link className="text-link" href="/shop">Browse our Perfumes</Link></div>
    </section>
    <section className="story-section story-ingredients"><h2>What goes into a bottle</h2><p>A fragrance changes as you wear it. Get to know the notes that shape its opening, heart and finish.</p>
      <div className="ingredient-library">{ingredients.map(([name, title, copy, slug]) => <Link key={slug} href={'/collection/' + slug} className="ingredient-entry">
        <img src={'/scent-families/' + slug + '.png'} alt="" loading="lazy" /><div><h3>{name}</h3><strong>{title}</strong><p>{copy}</p><span>Explore {name.toLowerCase()} perfumes</span></div>
      </Link>)}</div>
    </section>
    <section id="story-stores" className="story-section"><div className="story-store-heading"><h2>Step inside LRT</h2><p>Open daily, 9 am to midnight.<br />Choose a store for directions and a direct line to the team.</p></div><BranchCards /></section>
    <MapRoom />
  </article>;
}
