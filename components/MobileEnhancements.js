"use client";
import { useEffect, useRef, useState } from "react";
import { markets, familyColors } from "../lib/store-config";
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
