"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import Link from "./StoreLink";
import Bottle from "./ProductBottle";
import { createScentSlides } from "../lib/scent-slider";
const factors = [0.4, 0.3, 0.15, 0.55, 0.75];
const points = [
  [0, 0],
  [0.031, 0.006],
  [0.134, 0.012],
  [0.206, 0.023],
  [0.278, 0.047],
  [0.34, 0.07],
  [0.412, 0.105],
  [0.485, 0.158],
  [0.546, 0.246],
  [0.583, 0.55],
  [0.62, 0.825],
  [0.69, 0.9],
  [0.79, 0.94],
  [0.85, 0.956],
  [0.93, 0.975],
  [1, 1],
];
const pieces = [
  [383, 178, 104, -12],
  [960, 232, 118, 15],
  [295, 478, 129, -8],
  [1247, 455, 123, 20],
  [968, 590, 110, 30],
  [-15, 590, 255, -15],
  [1282, 40, 200, 15],
];
const shadows = [
  [345, 650, 170, 24],
  [720, 708, 320, 30],
  [1318, 638, 160, 22],
  [1045, 760, 150, 22],
];
const unit = (value) => `calc(${value} * var(--su))`;
const position = (x, y, width, height = width) => ({
  left: unit(x),
  top: unit(y),
  width: unit(width),
  height: unit(height),
});

function FamilyPieces({ image, corner }) {
  return (
    <div className={"scent-layer" + (corner ? " scent-corners" : "")}>
      {pieces.map(
        ([x, y, width, rotation], index) =>
          index >= 5 === corner && (
            <div
              key={index}
              className="scent-piece"
              style={{
                ...position(x, y, width),
                "--rotation": `${rotation}deg`,
                "--duration": `${3.2 + ((index * 37) % 19) / 10}s`,
                "--delay": `${-index * 0.63}s`,
              }}
            >
              <img
                src={image}
                alt=""
                width="128"
                height="128"
                draggable="false"
              />
            </div>
          ),
      )}
    </div>
  );
}
function coverage(t) {
  for (let i = 1; i < points.length; i++) {
    const [end, b] = points[i];
    if (t <= end) {
      const [start, a] = points[i - 1],
        k = (t - start) / (end - start);
      return a + (b - a) * k * k * (3 - 2 * k);
    }
  }
  return 1;
}

export default function ScentSlider({ products }) {
  const slides = useMemo(() => createScentSlides(products), [products]);
  const host = useRef(null),
    panels = useRef([]),
    tabs = useRef([]),
    underline = useRef(null);
  const engine = useRef({
    index: 0,
    busy: false,
    unit: 1,
    interaction: -Infinity,
    raf: 0,
  });
  const change = useRef(() => {});
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const node = host.current,
      state = engine.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width:820px), (orientation:portrait)");
    const context = document.createElement("canvas").getContext("2d");
    let disposed = false,
      opening = [],
      finish = null,
      pointer = null;
    const layers = (i) => [
      ...(panels.current[i]?.querySelectorAll(".scent-layer") || []),
    ];
    function mark(index, smooth = true) {
      const tab = tabs.current[index];
      if (tab && underline.current) {
        underline.current.style.width = tab.offsetWidth + "px";
        underline.current.style.transform = `translateX(${tab.offsetLeft}px)`;
        const scroller = node.querySelector(".scent-tab-scroll");
        scroller.scrollTo({
          left: tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2,
          behavior: smooth && !reduced.matches ? "smooth" : "instant",
        });
      }
    }
    function layout() {
      if (
        disposed ||
        !node.isConnected ||
        slides.some((_, i) => !panels.current[i])
      )
        return;
      const { width, height } = node.getBoundingClientRect();
      state.unit = mobile.matches
        ? Math.min(width / 640, Math.max(1, height - 100) / 620)
        : Math.min(width / 1440, height / 900);
      node.style.setProperty("--su", state.unit + "px");
      node.style.setProperty("--bottle-scale", String(state.unit * 2.7));
      context.font = "700 100px 'Scent Display'";
      slides.forEach((slide, i) => {
        const el = panels.current[i].querySelector(".scent-word"),
          m = context.measureText(slide.name);
        const ink =
          m.actualBoundingBoxLeft + m.actualBoundingBoxRight || m.width;
        let size = 445,
          spacing = 0.005;
        if ((ink / 100 + spacing * (slide.name.length - 1)) * size > 1330) {
          spacing = -0.035;
          size = Math.min(
            size,
            1400 / (ink / 100 + spacing * (slide.name.length - 1)),
          );
        }
        const available = mobile.matches
          ? Math.min(1440, width / state.unit) * 0.92
          : 1400;
        size = Math.min(
          size,
          available / (ink / 100 + spacing * (slide.name.length - 1)),
        );
        el.style.fontSize = `calc(${size} * var(--su))`;
        el.style.letterSpacing = spacing + "em";
        el.style.top = `calc(${403.5 + (0.698 * size) / 2 - 0.85 * size} * var(--su))`;
      });
      mark(state.target ?? state.index, false);
    }
    function settle(index) {
      slides.forEach((_, i) => {
        const panel = panels.current[i];
        if (!panel) return;
        panel.style.visibility = i === index ? "visible" : "hidden";
        panel.style.zIndex = i === index ? "2" : "0";
        panel.style.clipPath = "";
        layers(i).forEach((el) => (el.style.transform = ""));
      });
      state.index = state.target = index;
      state.busy = false;
      finish = null;
      setActive(index);
    }
    change.current = (index, direction, user = true) => {
      if (disposed || !node.isConnected) return;
      if (user) state.interaction = performance.now();
      if (state.busy || index === state.index) return;
      opening.forEach((a) => a.cancel());
      opening = [];
      state.target = index;
      mark(index);
      setActive(index);
      if (reduced.matches) {
        settle(index);
        return;
      }
      state.busy = true;
      const old = state.index,
        a = panels.current[old],
        b = panels.current[index];
      b.style.visibility = "visible";
      b.style.zIndex = "1";
      a.style.zIndex = "2";
      const outgoing = layers(old),
        incoming = layers(index),
        start = performance.now();
      finish = () => {
        cancelAnimationFrame(state.raf);
        settle(index);
      };
      function tick(now) {
        if (disposed || !node.isConnected) return;
        const t = Math.min(1, (now - start) / 970),
          c = coverage(t);
        const q = Math.max(0, Math.min(1, (t - 0.5) / 0.42)),
          k = 1 - (1 - q) ** 2,
          width = 1440 * state.unit;
        a.style.clipPath =
          direction > 0
            ? `inset(0 ${c * 100}% 0 0)`
            : `inset(0 0 0 ${c * 100}%)`;
        outgoing.forEach(
          (el) =>
            (el.style.transform = `translateX(${-direction * c * 0.14 * width}px)`),
        );
        incoming.forEach(
          (el, i) =>
            (el.style.transform = `translateX(${direction * (1 - k) * factors[i] * width}px)`),
        );
        if (t < 1) state.raf = requestAnimationFrame(tick);
        else settle(index);
      }
      tick(start);
    };
    function key(event) {
      if (
        !node.contains(document.activeElement) ||
        event.target.matches("input,textarea,select")
      )
        return;
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      change.current((state.index + dir + slides.length) % slides.length, dir);
    }
    function down(event) {
      state.interaction = performance.now();
      if (
        !event.isPrimary ||
        event.button !== 0 ||
        event.target.closest("a,button,.scent-tab-scroll")
      )
        return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
    function up(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      const x = event.clientX - pointer.x,
        y = event.clientY - pointer.y;
      pointer = null;
      if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y)) {
        const dir = x < 0 ? 1 : -1;
        change.current(
          (state.index + dir + slides.length) % slides.length,
          dir,
        );
      }
    }
    const cancel = () => (pointer = null);
    const interact = () => (state.interaction = performance.now());
    const observer = new ResizeObserver(layout);
    observer.observe(node);
    node.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    document.addEventListener("keydown", key);
    // Shopping, search and navigation interactions also give visitors a quiet six seconds.
    document.addEventListener("click", interact);
    document.addEventListener("keydown", interact);
    const onMotion = () => {
      if (reduced.matches) {
        finish?.();
        opening.forEach((a) => a.cancel());
      }
    };
    reduced.addEventListener("change", onMotion);
    const timer = setInterval(() => {
      const rect = node.getBoundingClientRect();
      if (
        !pausedRef.current &&
        !document.hidden &&
        rect.bottom > innerHeight * 0.35 &&
        rect.top < innerHeight &&
        !document.querySelector('[role="dialog"]') &&
        performance.now() - state.interaction >= 6000
      ) {
        change.current((state.index + 1) % slides.length, 1, false);
      }
    }, 2600);
    layout();
    settle(state.index < slides.length ? state.index : 0);
    document.fonts.ready.then(() => {
      if (disposed) return;
      layout();
      if (!reduced.matches && !state.busy && state.interaction === -Infinity) {
        opening = layers(state.index).map((el, i) =>
          el.animate(
            [
              { transform: `translateX(${factors[i] * 1440 * state.unit}px)` },
              { transform: "translateX(0)" },
            ],
            { duration: 900, easing: "cubic-bezier(.22,.8,.3,1)" },
          ),
        );
      }
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(state.raf);
      clearInterval(timer);
      observer.disconnect();
      opening.forEach((a) => a.cancel());
      state.busy = false;
      node.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      document.removeEventListener("keydown", key);
      document.removeEventListener("click", interact);
      document.removeEventListener("keydown", interact);
      reduced.removeEventListener("change", onMotion);
    };
  }, [slides]);

  const selected = slides[active] || slides[0];
  const step = (dir) =>
    change.current(
      (engine.current.index + dir + slides.length) % slides.length,
      dir,
    );
  return (
    <section
      className="scent-slider"
      ref={host}
      aria-label="Discover your LRT scent"
      aria-roledescription="carousel"
      tabIndex={0}
    >
      <h1 className="scent-accessible">
        Find your signature fragrance with LRT Perfumes
      </h1>
      {slides.map((slide, i) => (
        <div
          className="scent-panel"
          key={slide.name}
          ref={(el) => (panels.current[i] = el)}
          style={{
            background: slide.color,
            visibility: i === 0 ? "visible" : "hidden",
            zIndex: i === 0 ? 2 : 0,
          }}
          aria-hidden="true"
        >
          <div className="scent-frame">
            <div className="scent-layer">
              <span className="scent-word">{slide.name}</span>
            </div>
            <div className="scent-layer">
              {shadows.map(([x, y, w, h], j) => (
                <span
                  key={j}
                  className="scent-shadow"
                  style={position(x - w / 2, y - h / 2, w, h)}
                />
              ))}
            </div>
            <div className="scent-layer">
              {slide.product ? (
                <div
                  className={
                    "scent-product" + (slide.product.image ? " has-photo" : "")
                  }
                >
                  <Bottle product={slide.product} />
                </div>
              ) : (
                <img
                  className="scent-family-art"
                  src={slide.image}
                  alt=""
                  width="128"
                  height="128"
                  draggable="false"
                />
              )}
            </div>
            <FamilyPieces image={slide.image} corner={false} />
            <FamilyPieces image={slide.image} corner />
          </div>
        </div>
      ))}
      <div className="scent-ui">
        <div className="scent-tab-scroll">
          <div
            className="scent-tabs"
            role="group"
            aria-label="Choose a scent family"
          >
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide.name}
                ref={(el) => (tabs.current[i] = el)}
                aria-current={active === i ? "true" : undefined}
                onClick={() =>
                  change.current(i, i > engine.current.index ? 1 : -1)
                }
              >
                {slide.name}
              </button>
            ))}
            <span className="scent-underline" ref={underline} />
          </div>
        </div>
        <div className="scent-caption">
          <Link
            href={
              selected.product
                ? "/product/" + selected.product.slug
                : selected.href
            }
          >
            {selected.product?.name ||
              `Explore ${selected.name.toLowerCase()} perfumes`}{" "}
            <ArrowUpRight size={15} />
          </Link>
          <p>{selected.description}</p>
        </div>
        <button
          className="scent-arrow scent-prev"
          aria-label="Previous scent"
          onClick={() => step(-1)}
        >
          <ArrowLeft />
        </button>
        <Link className="scent-shop" href={selected.href}>
          SHOP {selected.name.toUpperCase()} <ArrowUpRight size={17} />
        </Link>
        <button
          className="scent-arrow scent-next"
          aria-label="Next scent"
          onClick={() => step(1)}
        >
          <ArrowRight />
        </button>
        <button
          className="scent-play"
          aria-label={paused ? "Play scent slideshow" : "Pause scent slideshow"}
          aria-pressed={paused}
          onClick={() => {
            engine.current.interaction = performance.now();
            setPaused((p) => !p);
          }}
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
        <span className="scent-counter">
          {String(active + 1).padStart(2, "0")} / {slides.length}
        </span>
      </div>
    </section>
  );
}
