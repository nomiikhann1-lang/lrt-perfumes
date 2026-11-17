"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { mobileHero, markets, familyColors } from "../lib/store-config";
export function ScentIcon({ family, size = 18 }) {
  if (!Object.hasOwn(familyColors, family)) return null;
  return (
    <img
      className="scent-icon"
      src={"/scent-families/" + family.toLowerCase() + ".png"}
      width={size}
      height={size}
      alt=""
    />
  );
}
export function MarketPicker({ country, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function dismiss(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return (
    <div
      className="flag-picker"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        className="flag-circle"
        aria-label={
          "Shopping region: " +
          markets[country].label +
          ", " +
          markets[country].currency
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <img src={markets[country].flag} alt="" />
      </button>
      {open && (
        <div
          className="flag-options"
          role="group"
          aria-label="Choose shopping region"
        >
          {Object.entries(markets).map(([code, m]) => (
            <button
              className="flag-circle"
              key={code}
              title={m.label + " · " + m.currency}
              aria-label={m.label + " · " + m.currency}
              aria-pressed={country === code}
              onClick={() => {
                onChange(code);
                setOpen(false);
              }}
            >
              <img src={m.flag} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function MobileHero() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    if (mobileHero.type !== "video") return;
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!q.matches)
      ref.current
        ?.play()
        .then(() => setPlaying(true))
        .catch(() => {});
  }, []);
  return (
    <div className="mobile-hero-media">
      {mobileHero.type === "video" && !failed ? (
        <>
          <video
            ref={ref}
            src={mobileHero.src}
            poster={mobileHero.poster}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            aria-label={mobileHero.alt}
          />
          <button
            className="video-toggle"
            aria-label={playing ? "Pause hero video" : "Play hero video"}
            onClick={() => {
              if (playing) {
                ref.current.pause();
                setPlaying(false);
              } else
                ref.current
                  .play()
                  .then(() => setPlaying(true))
                  .catch(() => setFailed(true));
            }}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </>
      ) : (
        <img
          src={mobileHero.type === "video" ? mobileHero.poster : mobileHero.src}
          alt={mobileHero.alt}
          fetchPriority="high"
        />
      )}
    </div>
  );
}
