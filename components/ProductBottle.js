import { bottleColor } from "../lib/store-config";

export default function Bottle({ product: p, small = false, volume = 50 }) {
  return (
    <div
      className={"bottle-scene " + (small ? "small" : "")}
      style={{ "--juice": bottleColor(p) }}
      aria-label={`${p.name} perfume bottle`}
      role="img"
    >
      {p.image ? (
        <img className="uploaded-bottle" src={p.image} alt="" />
      ) : (
        <>
          <div className="bottle-shadow" />
          <div className="bottle">
            <div className="cap" />
            <div className="neck" />
            <div className="glass">
              <div className="liquid" />
              <div className="label">
                <span className="bottle-brand">LRT Perfumes</span>
                <span className="bottle-rule" />
                <strong>{p.name}</strong>
                <small>PERFUME</small>
                <span className="bottle-size">{volume} ML</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
