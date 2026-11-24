import Link from './StoreLink';
import { scentFamilies, familyColors } from '../lib/store-config';

const guides = {
  Leather: ['Suede, smoke and polished leather', 'Dry, textured notes that can feel smoky or soft like suede. Try leather if you enjoy deeper woods and a less sweet finish.'],
  Aromatic: ['Lavender, herbs and green leaves', 'Herbal notes bring a fresh, green character. Compare aromatic fragrances with citrus or woody styles to find your preferred balance.'],
  Amber: ['Resins, vanilla and warm spices', 'Warm accords with resinous or softly sweet facets. Look for an amber fragrance when you enjoy enveloping scents with depth.'],
  Sweet: ['Vanilla, tonka and gourmand notes', 'From creamy vanilla to dessert-like accords, this family explores sweetness. Try it on skin to see how rich or subtle it becomes.'],
  Fruity: ['Pear, berries and orchard fruit', 'Juicy, bright notes that often accompany florals. Choose fruity scents for a lively opening, then explore the softer notes underneath.'],
  Fresh: ['Airy, aquatic and clean notes', 'Light-feeling accords with a crisp character. Fresh fragrances are a useful starting point if you prefer less sweetness or warmth.'],
  Citrus: ['Bergamot, lemon and mandarin', 'Zesty, sparkling notes that are often most noticeable at the opening. Give the fragrance time to reveal its floral, herbal or woody base.'],
  Spicy: ['Pepper, cardamom and cinnamon', 'Spice can feel bright and peppery or warm and rounded. Compare a few examples to discover which kind of warmth you enjoy.'],
  Floral: ['Rose, jasmine and blossoms', 'From a single flower to a layered bouquet, florals range from fresh and green to soft and powdery. Start with a flower you already enjoy.'],
  Woody: ['Cedar, sandalwood and vetiver', 'Dry, creamy or earthy notes give woody fragrances their character. Look for citrus or spice alongside the woods for a different opening.'],
};

export default function FragranceGuide() {
  return <article className="fragrance-guide">
    <section className="guide-intro"><div><h1>Fragrance guide</h1><p>Find the notes you enjoy, understand how a Perfume develops, and build a shortlist to try.</p><nav aria-label="Fragrance family guide">{scentFamilies.map(f => <a key={f} href={'#guide-' + f.toLowerCase()}>{f}</a>)}</nav></div><img src="/perfume-ingredients.png" alt="A selection of fragrance ingredients" /></section>
    <section className="guide-method"><h2>Give a Perfume time to unfold</h2><div><h3>The opening</h3><p>The first impression often comes from brighter, lighter notes. Notice what you enjoy, then allow it to settle.</p></div><div><h3>The heart and finish</h3><p>Return to the fragrance as it develops. The heart shapes its character; the base leaves the lasting impression.</p></div></section>
    <section className="guide-families" aria-label="All fragrance families">{scentFamilies.map(f => <section className="guide-family" id={'guide-' + f.toLowerCase()} key={f} style={{'--guide-tone':familyColors[f]}}><div className="guide-family-image"><img src={'/scent-families/' + f.toLowerCase() + '.png'} alt={f + ' fragrance family'} loading="lazy" /></div><div><h2>{f}</h2><h3>{guides[f][0]}</h3><p>{guides[f][1]}</p><Link className="text-link" href={'/collection/' + f.toLowerCase()}>Explore {f} Perfumes</Link></div></section>)}</section>
    <section className="guide-visit"><h2>Try your shortlist in store</h2><p>Start with a few scents, try your favourites on skin and revisit them before deciding. Our team can help you compare families and find a bottle size that suits you.</p><Link className="primary" href="/stores">Find an LRT store</Link></section>
  </article>;
}
