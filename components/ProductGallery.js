"use client";
import { useState } from "react";
import { productImages } from "../lib/storefront-data";
export default function ProductGallery({ product, size, fallback }) {
  const images = productImages(product, size);
  const [chosen, setChosen] = useState(null);
  const active = images.find((i) => i.src === chosen) || images[0];
  if (!active) return fallback;
  return (
    <div className="product-gallery">
      <img
        className="gallery-main"
        src={active.src}
        alt={active.alt || product.name}
        loading="eager"
      />
      {images.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Product images">
          {images.map((i, n) => (
            <button
              key={i.src}
              aria-label={`View image ${n + 1}`}
              aria-pressed={active.src === i.src}
              onClick={() => setChosen(i.src)}
            >
              <img src={i.src} alt="" loading="eager" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
