"use client";
import { useEffect, useState } from "react";

export default function useResponsiveVideo(desktopSrc, mobileSrc = desktopSrc) {
  const [mobile, setMobile] = useState(null);
  useEffect(() => {
    const query = window.matchMedia("(max-width:760px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  // Wait for the viewport so mobile visitors do not download the desktop film.
  return mobile === null ? undefined : mobile ? mobileSrc : desktopSrc;
}
