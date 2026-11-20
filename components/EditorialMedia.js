"use client";
import { useEffect, useRef, useState } from "react";
import Link from "./StoreLink";
import { Play, Pause, ArrowUpRight } from "lucide-react";
import useResponsiveVideo from "./useResponsiveVideo";
export default function EditorialMedia({ video = false }) {
  const src = useResponsiveVideo("/campaign-film.mp4", "/Campaign-six.mp4");
  const poster = src === "/Campaign-six.mp4" ? "/campaign-six.webp" : "/campaign-wide.webp";
  const ref = useRef(null),
    manualPause = useRef(false);
  const [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!video || failed || !src) return;
    const el = ref.current;
    if (!el) return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (visible && !mq.matches && !manualPause.current && !document.hidden)
        el.play().catch(() => {});
      else el.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    mq.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      el.pause();
    };
  }, [video, failed, src]);
  function toggle() {
    manualPause.current = playing;
    if (playing) ref.current.pause();
    else ref.current.play().catch(() => setFailed(true));
  }
  return (
    <section
      className={"campaign-media " + (video ? "campaign-film" : "")}
      aria-label={video ? "LRT campaign film" : "LRT editorial campaign"}
    >
      {video && !failed ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          src={poster}
          alt="LRT perfume surrounded by flowers, citrus and flowing pastel fabric"
          loading="eager"
          decoding="async"
        />
      )}
      <div className="campaign-copy">
        <h2>
          {video ? (
            <>
              Let the moment
              <br />
              <em>linger.</em>
            </>
          ) : (
            <>
              Wear a feeling.
              <br />
              <em>Keep a memory.</em>
            </>
          )}
        </h2>
        <Link href={video ? "/collection/amber" : "/collection"}>
          {video ? "Explore amber fragrances" : "Discover the collections"}{" "}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      {video && !failed && (
        <button
          className="film-control"
          aria-label={playing ? "Pause campaign film" : "Play campaign film"}
          onClick={toggle}
        >
          {playing ? <Pause size={19} /> : <Play size={19} />}
          <span>{playing ? "Pause" : "Play"} film</span>
        </button>
      )}
    </section>
  );
}
