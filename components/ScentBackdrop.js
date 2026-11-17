import { scentFamilies, scentFamily } from "../lib/store-config";

export default function ScentBackdrop({ product }) {
  const family = scentFamily(product);
  if (!family) return null;
  const index = scentFamilies.indexOf(family);
  const ingredientPosition = `${((index % 4) / 3) * 100}% ${(Math.floor(index / 4) / 2) * 100}%`;

  return (
    <div
      className="scent-backdrop"
      data-family={family}
      aria-hidden="true"
      style={{ "--ingredient-position": ingredientPosition }}
    >
      <img
        className="scent-family-accent"
        src={`/scent-families/${family.toLowerCase()}.png`}
        alt=""
        width="128"
        height="128"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
      <span className="scent-ingredient-piece scent-ingredient-left">
        <span className="scent-ingredient" />
      </span>
      <span className="scent-ingredient-piece scent-ingredient-right">
        <span className="scent-ingredient" />
      </span>
    </div>
  );
}
