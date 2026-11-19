"use client";
import { useRef, useState, useEffect } from "react";
import Link from "./StoreLink";
import useResponsiveVideo from "./useResponsiveVideo";
export default function ShopPromotion({ promo }) {
  const src = useResponsiveVideo(promo.src, promo.mobileSrc);
  const ref = useRef(null),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!src) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)"),
      video = ref.current;
    const update = () => {
      if (motion.matches) video.pause();
      else video.play().catch(() => {});
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, [src]);
  return (
    <aside className="shop-film">
      <video
        ref={ref}
        src={src}
        poster={src === promo.mobileSrc && promo.mobilePoster ? promo.mobilePoster : promo.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <Link href={promo.href}>
        {promo.title && <strong>{promo.title}</strong>}
        <span>{promo.button} ↗</span>
      </Link>
      <button
        aria-label={(playing ? "Pause " : "Resume ") + (promo.title || "campaign") + " film"}
        onClick={() =>
          playing ? ref.current.pause() : ref.current.play().catch(() => {})
        }
      >
        {playing ? "Still" : "Motion"}
      </button>
    </aside>
  );
}
