"use client";

import { useEffect, useRef, useState } from "react";

const ELFSIGHT_APP_ID = "9dafafb2-e13f-49c3-9ece-196fe4e38e70";
const SCRIPT_SRC = "https://elfsightcdn.com/platform.js";

// Lazy-loads the Elfsight script only when the widget enters the viewport.
// Saves ~100-300KB of JS execution on initial page load.
export default function ElfsightReviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={`elfsight-app-${ELFSIGHT_APP_ID} min-h-[400px]`}
    />
  );
}
