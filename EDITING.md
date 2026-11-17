# Editing the storefront

**Shop films.** In `lib/shop-promotions.js`, edit the title, button label, destination, MP4 and poster. Add media under public/ and use a path starting with /. Films rotate through the available campaigns. A new shop visit picks left or right edge positions after the first row. Positions stay stable while scrolling. Each film fills one mobile tile. Still pauses playback and Motion resumes it. Reduced-motion visitors start with the poster.

**Our Story and locations.** Edit addresses, phones, directions, Google Maps embed URLs, hero images and colours in `lib/story-content.js`. Edit the story layout in `components/OurStory.js` and the shared store template in `components/StoreVisits.js`. Store pages use /stores/ followed by the branch slug. Typography and interaction styles are in `app/storefront-v12.css`.

**Scent families.** Install the bundled bridge update in WordPress. In a product’s General tab, select one Scent family under LRT Perfumes scent details. The storefront uses it for both product-page labels and search icons. New CSV exports use the Scent family column. Older exports still import. The old labels Flowery, Earthy/Oud, Herbal, Warm and Gourmand map to Floral, Woody, Aromatic, Amber and Sweet respectively. A recognized Scent family takes priority over Legacy family on existing products. Products without a recognized family show no family icon.

Family colours are in `lib/store-config.js`. The ten small PNGs are in `public/scent-families/`.
