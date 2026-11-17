"use client";
import { useRef, useState, useEffect } from "react";
import Link from "./StoreLink";
export default function ShopPromotion({ promo }) {
  const ref = useRef(null),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)"),
      video = ref.current;
    const update = () => {
      if (motion.matches) video.pause();
      else video.play().catch(() => {});
    };
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  return (
    <aside className="shop-film">
      <video
        ref={ref}
        src={promo.src}
        poster={promo.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <Link href={promo.href}>
        <strong>{promo.title}</strong>
        <span>{promo.button} ↗</span>
      </Link>
      <button
        aria-label={(playing ? "Pause " : "Resume ") + promo.title + " film"}
        onClick={() =>
          playing ? ref.current.pause() : ref.current.play().catch(() => {})
        }
      >
        {playing ? "Still" : "Motion"}
      </button>
    </aside>
  );
}
